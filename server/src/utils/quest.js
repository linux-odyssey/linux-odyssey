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

export default async function loadAndUpdateQuests() {
  const questNames = await fs.readdir(questDirectory)

  const quests = Promise.all(
    questNames.map(async (id) => {
      const fullPath = path.join(questDirectory, id, 'README.md')

      try {
        // Read and parse the README.md file.
        const markdown = await fs.readFile(fullPath, 'utf-8')

        // Extract and parse YAML frontmatter.
        const match = /---\n([\s\S]+?)\n---/.exec(markdown)
        const metadata = yaml.parse(match[1])
        const content = markdown.slice(match[0].length)
        const htmlContent = marked.parse(content)

        const { title, order } = metadata

        return Quest.findByIdAndUpdate(
          id,
          {
            _id: id,
            title,
            order,
            content: htmlContent,
          },
          {
            upsert: true,
          }
        )
      } catch (error) {
        console.error(`Error parsing quest ${id}:`, error)
        throw error
      }
    })
  )

  return quests
}
