import { TRPCError } from '@trpc/server'
import { ISession, Session } from '@linux-odyssey/models'
import { GameSession, VoidFileExistenceChecker } from '@linux-odyssey/game'
import { z } from 'zod'
import { createNewSession, isQuestUnlocked } from '../models/sessionManager.js'
import config from '../config.js'
import { protectedProcedure, router } from '../trpc.js'
import { questManager } from '../models/quest.js'

export type SessionDetail = Awaited<ReturnType<typeof sessionDetail>>

function sessionDetail(session: ISession) {
  const quest = questManager.get(session.quest)
  if (!quest) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Quest not found.',
    })
  }
  const gameSession = new GameSession(
    session,
    quest,
    new VoidFileExistenceChecker()
  )
  return {
    _id: session._id.toString(),
    user: session.user.toString(),
    quest: session.quest,
    status: session.status,
    createdAt: session.createdAt.toISOString(),
    lastActivityAt: session.lastActivityAt.toISOString(),
    completedEvents: session.completedEvents,
    responses: gameSession.getResponses(),
    tasks: gameSession.getTasks(),
    graph: gameSession.getGraph(),
  }
}

export const sessionRouter = router({
  createSession: protectedProcedure
    .input(z.object({ questId: z.string() }))
    .mutation(async (opts) => {
      const { questId } = opts.input
      const { user } = opts.ctx
      console.log('createSession', user, questId)
      if ((await isQuestUnlocked(user.id, questId)) || config.testing.enabled) {
        const session = await createNewSession(user.id, questId)
        return sessionDetail(session)
      }
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Quest is locked.',
      })
    }),

  getActiveSession: protectedProcedure
    .input(
      z.object({
        questId: z.string(),
      })
    )
    .query(async (opts) => {
      const { questId } = opts.input
      const { user } = opts.ctx
      const session = await Session.findOne({
        user: user.id,
        quest: questId,
        status: 'active',
      })
      if (!session) {
        return null
      }
      return sessionDetail(session)
    }),
})
