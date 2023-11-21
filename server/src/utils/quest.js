import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

import { Quest } from '@linux-odyssey/models'
import logger from './logger'

const questDirectory = path.join(process.cwd(), '..', 'quests')

async function mapQuests(callback) {
  const questNames = await fs.readdir(questDirectory, {
    withFileTypes: true,
  })

  return Promise.all(
    questNames
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map((dirent) => {
        const id = dirent.name
        const questPath = path.join(questDirectory, id)
        return callback(id, questPath)
      })
  )
}

export function loadAndUpdateQuests() {
  return mapQuests(async (id, questPath) => {
    const files = await fs.readdir(questPath)
    if (!files.includes('game.yml')) {
      throw new Error(`Quest ${id} is missing game.yml`)
    }

    try {
      const body = await fs.readFile(path.join(questPath, 'game.yml'), 'utf-8')

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
      logger.error(`Error parsing quest ${id}:`, error)
      throw error
    }
  })
}

export async function getQuestDockerfiles() {
  const quests = await mapQuests(async (id, questPath) => {
    const files = await fs.readdir(questPath)
    return files.includes('Dockerfile') ? { id, questPath } : null
  })
  return quests.filter((quest) => quest !== null)
}
