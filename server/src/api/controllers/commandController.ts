import type { Request, Response } from 'express'
import { GameSession, commandSchema } from '../../../../packages/game'
import { Command, Session } from '../../../../packages/models'
import { pushToSession } from '../socket'
import { finishSession } from '../../models/sessionManager'
import { asyncHandler } from '../../middleware/error'
import { questManager } from '../../models/quest'
import { CLIFileExistenceChecker } from '../../containers/cli'

export const newCommand = asyncHandler(async (req: Request, res: Response) => {
  console.log('newCommand', JSON.stringify(req.body, null, 2))
  const body = commandSchema.safeParse(req.body)
  if (!body.success) {
    res.status(400).json({ message: 'Invalid command', errors: body.error })
    return
  }
  const command = body.data

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
    new CLIFileExistenceChecker(session.containerId!)
  )

  const event = await gameSession.runCommand(command)

  const c = new Command({
    ...command,
    session: sessionId,
    stage: event,
  })

  await c.save()
  if (event) {
    session.completedEvents = gameSession.completedEvents
    session.graph = gameSession.getGraph()

    if (gameSession.isFinished()) {
      await finishSession(session)
    }
    pushToSession(session.id, 'update', {
      responses: gameSession.getResponses(),
      tasks: gameSession.getTasks(),
      status: session.status,
    })
  }
  if (command.params) {
    session.graph = gameSession.getGraph()
    pushToSession(session.id, 'graph', command.params)
  }
  await session.save()

  res.status(200).end()
})
