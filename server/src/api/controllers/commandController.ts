import { GameSession, commandSchema } from '@linux-odyssey/game'
import { Command, Session } from '@linux-odyssey/models'
import type { Request, Response } from 'express'
import { pushToSession } from '../socket.js'
import { finishSession } from '../../models/sessionManager.js'
import { asyncHandler } from '../../middleware/error.js'
import { questManager } from '../../models/quest.js'
import { CLIFileExistenceChecker } from '../../containers/cli.js'

export const newCommand = asyncHandler(async (req: Request, res: Response) => {
  const command = commandSchema.parse(req.body)

  console.log('command', command)

  const { sessionId } = req.user as any
  const session = await Session.findById(sessionId)
  if (!session) {
    res.status(404).json({ message: 'session not found' })
    return
  }
  if (session.status === 'finished') {
    // Allow commands to be sent to finished sessions
    res.status(200).end()
    return
  }
  if (session.status !== 'active') {
    res.status(400).json({ message: 'session is not active' })
    return
  }

  session.lastActivityAt = new Date()

  const quest = await questManager.get(session.quest)
  if (!quest) {
    res.status(404).json({ message: 'quest not found' })
    return
  }

  const gameSession = new GameSession(
    session,
    quest,
    new CLIFileExistenceChecker()
  )

  const event = await gameSession.runCommand(command)
  console.log('event', event)

  const c = new Command({
    ...command,
    session: sessionId,
    stage: event,
  })

  await c.save()
  if (event) {
    session.completedEvents = gameSession.completedEvents

    if (gameSession.isFinished()) {
      await finishSession(session)
    } else {
      await session.save()
    }
    pushToSession(session.id, 'update', {
      responses: gameSession.getResponses(),
      tasks: gameSession.getTasks(),
      status: session.status,
    })
  }

  res.status(200).end()
})
