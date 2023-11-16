import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

import { Quest } from '@linux-odyssey/models'

const questDirectory = path.join(process.cwd(), '..', 'quests')

export default async function loadAndUpdateQuests() {
  const questNames = await fs.readdir(questDirectory, {
    withFileTypes: true,
  })

  const quests = Promise.all(
    questNames
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(async (dirent) => {
        const id = dirent.name
        const questPath = path.join(questDirectory, id)
        const files = await fs.readdir(questPath)
        if (!files.includes('game.yml')) {
          throw new Error(`Quest ${id} is missing game.yml`)
        }

        try {
          const body = await fs.readFile(
            path.join(questPath, 'game.yml'),
            'utf-8'
          )

          const quest = yaml.parse(body, {
            merge: true,
          })

          const image = files.includes('Dockerfile') ? id : 'base'

          return Quest.findByIdAndUpdate(
            id,
            {
              _id: id,
              image,
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
