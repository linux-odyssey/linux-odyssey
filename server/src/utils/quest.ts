import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

import { Quest } from '@linux-odyssey/models'
import logger from './logger.js'

const questDirectory = path.join(process.cwd(), '..', 'quests')

class QuestValidationError extends Error {
  questId: string
  error: any

  constructor(message: string, questId: string, error: any) {
    super(message)
    this.name = 'QuestValidationError'
    this.questId = questId
    this.error = error
  }
}

// eslint-disable-next-line no-unused-vars
type QuestCallback = (id: string, questPath: string) => Promise<any>

async function mapQuests(callback: QuestCallback) {
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

async function loadGlobalExceptions() {
  const exceptionsPath = path.join(questDirectory, 'exceptions.yml')
  const body = await fs.readFile(exceptionsPath, 'utf-8')
  return yaml.parse(body)
}

export async function loadAndUpdateQuests() {
  await Quest.deleteMany({})
  const { exceptions } = await loadGlobalExceptions()
  return mapQuests(async (id, questPath) => {
    const files = await fs.readdir(questPath)
    if (!files.includes('game.yml')) {
      throw new QuestValidationError(`Missing game.yml`, id, null)
    }

    try {
      const body = await fs.readFile(path.join(questPath, 'game.yml'), 'utf-8')

      const questData = yaml.parse(body, {
        merge: true,
      })

      const image = files.includes('Dockerfile') ? id : 'base'
      const quest = new Quest({
        _id: id,
        image,
        ...questData,
      })
      quest.exceptions.push(...exceptions)
      await quest.save()
    } catch (error) {
      logger.error(`Error parsing quest`, { id, error })
      throw new QuestValidationError(`Error parsing quest`, id, error)
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
