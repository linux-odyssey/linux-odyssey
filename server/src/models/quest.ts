/* eslint-disable max-classes-per-file */
import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

import type { QuestLocale } from '../../../packages/constants'
import { SUPPORTED_LOCALES } from '../../../packages/constants'
import {
  questSchema,
  globalExceptionSchema,
  IQuest,
} from '../../../packages/game'
import logger from '../utils/logger.js'
import config from '../config.js'

class QuestValidationError extends Error {
  questId: string
  error: any

  constructor(message: string, questId: string, error: any) {
    super(message)
    this.name = 'QuestValidationError'
    this.questId = questId
    this.error = error
  }

  toString() {
    if (this.error?.issues) {
      const issues = this.error.issues
        .map((issue: any) => {
          const fieldPath = issue.path.join('.')
          return `- ${fieldPath}: ${issue.message}`
        })
        .join('\n')
      return `Error in quest "${this.questId}":\n${issues}`
    }
    return `Error in quest "${this.questId}": ${this.message}`
  }
}

function questImageId(id: string, locale: QuestLocale) {
  return `${id}-${locale.toLowerCase()}`
}

class QuestManager {
  private quests = new Map<string, Map<QuestLocale, IQuest>>()
  private questDirectory = path.join(config.projectRoot, 'quests')

  get(id: string, locale: QuestLocale) {
    return this.quests.get(id)?.get(locale)
  }

  getAll(locale: QuestLocale) {
    return Array.from(this.quests.values())
      .map((versions) => versions.get(locale))
      .filter((quest): quest is IQuest => quest !== undefined)
  }

  private async mapQuests(callback: QuestCallback) {
    const questNames = await fs.readdir(this.questDirectory, {
      withFileTypes: true,
    })

    return Promise.all(
      questNames
        .filter(
          (dirent) => dirent.isDirectory() && !dirent.name.startsWith('.')
        )
        .map((dirent) => {
          const id = dirent.name
          const questPath = path.join(this.questDirectory, id)
          return callback(id, questPath)
        })
    )
  }

  private async loadGlobalExceptions() {
    try {
      const exceptionsPath = path.join(this.questDirectory, 'exceptions.yml')
      const body = await fs.readFile(exceptionsPath, 'utf-8')
      return globalExceptionSchema.array().parse(yaml.parse(body))
    } catch (error) {
      logger.error('Error loading global exceptions', { error })
      throw new QuestValidationError(
        'Failed to load global exceptions',
        'global',
        error
      )
    }
  }

  async loadAndUpdateQuests() {
    const exceptions = await this.loadGlobalExceptions()
    const loaded = new Map<string, Map<QuestLocale, IQuest>>()

    await this.mapQuests(async (id, questPath) => {
      const entries = await fs.readdir(questPath, { withFileTypes: true })
      const versions = new Map<QuestLocale, IQuest>()

      for (const locale of SUPPORTED_LOCALES) {
        const localeEntry = entries.find((entry) => entry.name === locale)

        if (!localeEntry) {
          logger.warn(`Missing locale "${locale}" for quest "${id}"`)
          // eslint-disable-next-line no-continue
          continue
        }

        if (!localeEntry.isDirectory()) {
          throw new QuestValidationError(
            `${locale} exists but is not a directory`,
            id,
            null
          )
        }

        const localePath = path.join(questPath, locale)

        try {
          const files = await fs.readdir(localePath)

          if (!files.includes('game.yml')) {
            throw new QuestValidationError(
              `Missing ${locale}/game.yml`,
              id,
              null
            )
          }

          const body = await fs.readFile(
            path.join(localePath, 'game.yml'),
            'utf-8'
          )

          const questData = yaml.parse(body, {
            merge: true,
          })

          const image = files.includes('Dockerfile')
            ? questImageId(id, locale)
            : 'base'
          const quest = questSchema.parse({
            id,
            image,
            ...questData,
          })
          quest.exceptions = [...exceptions]
          versions.set(locale, quest)
        } catch (error) {
          logger.error(`Error parsing quest ${id} for locale ${locale}`, {
            error,
          })
          throw new QuestValidationError(
            `Error parsing quest ${id} for locale ${locale}`,
            id,
            error
          )
        }
      }

      if (versions.size > 0) {
        loaded.set(id, versions)
      } else {
        logger.warn(`No valid locales found for quest "${id}"`)
      }
    })

    this.quests = loaded
  }

  async getQuestDockerfiles() {
    const questlist = await this.mapQuests(async (id, questPath) => {
      const entries = await fs.readdir(questPath, { withFileTypes: true })
      const dockerfiles: { id: string; questPath: string }[] = []

      for (const locale of SUPPORTED_LOCALES) {
        const localeEntry = entries.find((entry) => entry.name === locale)

        if (!localeEntry) {
          logger.warn(`Missing locale "${locale}" for quest "${id}"`)
          // eslint-disable-next-line no-continue
          continue
        }

        if (!localeEntry.isDirectory()) {
          throw new QuestValidationError(
            `${locale} exists but is not a directory`,
            id,
            null
          )
        }

        const localePath = path.join(questPath, locale)
        const files = await fs.readdir(localePath)

        if (files.includes('Dockerfile')) {
          dockerfiles.push({
            id: questImageId(id, locale),
            questPath: localePath,
          })
        }
      }

      return dockerfiles.length > 0 ? dockerfiles : null
    })

    return questlist.filter((quest) => quest !== null)
  }
}

// eslint-disable-next-line no-unused-vars
type QuestCallback = (id: string, questPath: string) => Promise<any>

export const questManager = new QuestManager()
