import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc.js'
import { questManager } from '../models/quest.js'
import { SUPPORTED_LOCALES } from '../../../packages/constants'

export const questRouter = router({
  getQuests: publicProcedure
    .input(z.object({ locale: z.enum(SUPPORTED_LOCALES) }))
    .query(async ({ input }) => {
      const quests = questManager.getAll(input.locale)

      return quests.map(({ title, id, requirements }) => ({
        id,
        title,
        requirements,
      }))
    }),

  getQuestDetail: publicProcedure
    .input(z.object({ questId: z.string(), locale: z.enum(SUPPORTED_LOCALES) }))
    .query(async ({ input }) => {
      const { questId, locale } = input
      const quest = questManager.get(questId, locale)

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
