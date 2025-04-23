import { TRPCError } from '@trpc/server'
import { Session } from '@linux-odyssey/models'
import { GameSession, VoidFileExistenceChecker } from '@linux-odyssey/game'
import { z } from 'zod'
import { isQuestUnlocked } from '../models/sessionManager.js'
import config from '../config.js'
import { protectedProcedure, router } from '../trpc.js'
import { questManager } from '../models/quest.js'

export const sessionRouter = router({
  getActiveSession: protectedProcedure
    .input(
      z.object({
        questId: z.string(),
      })
    )
    .query(async (opts) => {
      const { questId } = opts.input
      const { user } = opts.ctx
      if (
        user &&
        ((await isQuestUnlocked(user, questId)) || config.testing.enabled)
      ) {
        const session = await Session.findOne({
          user: user.id,
          quest: questId,
          status: 'active',
        })
        if (!session) {
          return null
        }
        const quest = await questManager.get(questId)
        if (!quest) {
          return null
        }
        const gameSession = new GameSession(
          session,
          quest,
          new VoidFileExistenceChecker()
        )
        return {
          _id: session._id.toString(),
          user: session.user,
          quest: session.quest,
          status: session.status,
          createdAt: session.createdAt,
          lastActivityAt: session.lastActivityAt,
          completedEvents: session.completedEvents,
          responses: gameSession.getResponses(),
          tasks: gameSession.getTasks(),
        }
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Quest is locked',
      })
    }),
})
