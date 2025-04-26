import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc.js'
import { questManager } from '../models/quest.js'

export const questRouter = router({
  getQuests: publicProcedure.query(async () => {
    const quests = questManager.getAll()
    return quests.map(({ title, id, requirements }) => ({
      id,
      title,
      requirements,
    }))
  }),
  getQuestDetail: publicProcedure.input(z.string()).query(async (opts) => {
    const questId = opts.input
    const quest = questManager.get(questId)
    if (!quest) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Quest not found.',
      })
    }
    const { id, title, instruction, requirements } = quest
    return { id, title, instruction, requirements }
  }),
})
