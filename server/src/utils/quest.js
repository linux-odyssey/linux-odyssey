import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

import { Quest } from '@linux-odyssey/models'

const questDirectory = path.join(process.cwd(), '..', 'quests')

export default async function loadAndUpdateQuests() {
  const questNames = await fs.readdir(questDirectory)

  const quests = Promise.all(
    questNames.map(async (id) => {
      // Check if id is directory
      const stat = await fs.stat(path.join(questDirectory, id))
      if (!stat.isDirectory()) {
        return null
      }
      const fullPath = path.join(questDirectory, id, 'game.yml')

      try {
        // Read and parse the README.md file.
        const body = await fs.readFile(fullPath, 'utf-8')

        const quest = yaml.parse(body)

        return Quest.findByIdAndUpdate(
          id,
          {
            id,
            ...quest,
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
