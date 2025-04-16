import { TRPCError } from '@trpc/server'
import { Quest } from '@linux-odyssey/models'
import { QuestDetailResponse } from '@linux-odyssey/constants'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc.js'

export const questRouter = router({
  getQuests: publicProcedure.query(async () => {
    const quests = await Quest.find({})
    return quests.map(({ title, _id, requirements }) => ({
      _id,
      title,
      requirements,
    }))
  }),
  getQuestDetail: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<QuestDetailResponse> => {
      const id = opts.input
      const quest = await Quest.findById(id)
      if (!quest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Quest not found.',
        })
      }
      const { _id, title, instruction, requirements } = quest
      return { _id, title, instruction, requirements }
    }),
})
