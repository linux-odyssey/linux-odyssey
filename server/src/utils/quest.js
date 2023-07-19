import fs from 'fs/promises'
import path from 'path'
import { marked } from 'marked'
import yaml from 'yaml'

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

        return {
          name,
          metadata,
          content: htmlContent,
        }
      } catch (error) {
        console.error(`Error parsing quest ${name}:`, error)
        return null
      }
    })
  )

  return quests
}

parseQuests().then((quests) => console.log(quests))
