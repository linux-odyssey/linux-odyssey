import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ISession, Session } from '../../../packages/models'
import { GameSession, VoidFileExistenceChecker } from '../../../packages/game'
import { createNewSession, isQuestUnlocked } from '../models/sessionManager.js'
import config from '../config.js'
import { protectedProcedure, router } from '../trpc.js'
import { questManager } from '../models/quest.js'
import { genJWT } from '../utils/auth'

export type SessionDetail = Awaited<ReturnType<typeof sessionDetail>>

async function sessionDetail(session: ISession) {
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
  const token = await genJWT({
    sessionId: session._id.toString(),
  })

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
    containerName: session.containerName,
    token,
  }
}

export const sessionRouter = router({
  createSession: protectedProcedure
    .input(z.object({ questId: z.string() }))
    .mutation(async (opts) => {
      const { questId } = opts.input
      const { user } = opts.ctx
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
