import { Command, Quest, Session } from '@linux-odyssey/models'
import { matchedData } from 'express-validator'
import type { Request, Response } from 'express'
import CommandHandler from '../../game/commandHandler.js'
import { pushToSession } from '../socket.js'
import { finishSession } from '../../models/sessionManager.js'
import { asyncHandler } from '../../middleware/error.js'

export const newCommand = asyncHandler(async (req: Request, res: Response) => {
  const { command, pwd, output, error, params } = matchedData(req)
  console.log(command, output, error)

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

  const c = new Command({
    session,
    command,
    pwd,
    output,
    error,
  })

  await c.save()

  const quest = await Quest.findById(session.quest)
  if (!quest) {
    res.status(404).json({ message: 'quest not found' })
    return
  }

  const commandHandler = new CommandHandler(session, quest, c, params)
  const response = await commandHandler.run()
  if (response) {
    c.stage = response.stage
    await c.save()

    if ((session.status as string) === 'finished') {
      await finishSession(session)
    }
    pushToSession(session.id, 'response', response)
  }

  res.status(200).end()
  await session.save()
})
