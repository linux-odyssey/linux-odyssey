import fs from 'fs/promises'
import path from 'path'
import { Marked } from 'marked'
import yaml from 'yaml'

import Quest from '../models/quest.js'

const marked = new Marked({
  mangle: false,
  headerIds: false,
})

const questDirectory = path.join(process.cwd(), 'quests')

async function parseQuests() {
  const questNames = await fs.readdir(questDirectory)

  const quests = Promise.all(
    questNames.map(async (name) => {
      const fullPath = path.join(questDirectory, name, 'README.md')

      try {
        // Read and parse the README.md file.
        const markdown = await fs.readFile(fullPath, 'utf-8')

        // Extract and parse YAML frontmatter.
        const match = /---\n([\s\S]+?)\n---/.exec(markdown)
        const metadata = yaml.parse(match[1])
        const content = markdown.slice(match[0].length)
        const htmlContent = marked.parse(content)

        const { title, order } = metadata

        return {
          name,
          title,
          order,
          content: htmlContent,
        }
      } catch (error) {
        console.error(`Error parsing quest ${name}:`, error)
        throw error
      }
    })
  )

  return quests
}

async function updateQuests(quests) {
  Promise.all(
    quests.map((quest) => {
      return Quest.findOneAndUpdate({ name: quest.name }, quest, {
        upsert: true,
      })
    })
  )
}

export default async function loadAndUpdateQuests() {
  const quests = await parseQuests()
  await updateQuests(quests)
}
