import { describe, it, expect, beforeAll } from '@jest/globals'
import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'
import { questSchema } from '../src/quest/quest.js'

describe('Parse all quests', () => {
  let quests: any[] = []

  test('should parse all quests', async () => {
    const questDirectory = path.join(process.cwd(), 'quests')

    const loadQuests = async () => {
      const questNames = await fs.readdir(questDirectory, {
        withFileTypes: true,
      })

      return Promise.all(
        questNames
          .filter(
            (dirent) => dirent.isDirectory() && !dirent.name.startsWith('.')
          )
          .map(async (dirent) => {
            const id = dirent.name
            const questPath = path.join(questDirectory, id)
            const files = await fs.readdir(questPath)
            if (!files.includes('game.yml')) {
              throw new Error(`Missing game.yml in quest ${id}`)
            }

            const body = await fs.readFile(
              path.join(questPath, 'game.yml'),
              'utf-8'
            )
            const questData = yaml.parse(body, { merge: true })
            const image = files.includes('Dockerfile') ? id : 'base'
            return {
              id,
              image,
              ...questData,
            }
          })
      )
    }

    quests = await loadQuests()
    quests.forEach((quest) => {
      console.log(`Quest ID: ${quest.id}`)
      expect(questSchema.safeParse(quest).error).toBeUndefined()
    })
  })
})
