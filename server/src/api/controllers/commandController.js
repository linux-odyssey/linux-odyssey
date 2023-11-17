import { Command, Session } from '@linux-odyssey/models'
import { matchedData } from 'express-validator'
import CommandHandler from '../../game/commandHandler.js'
import { pushToSession } from '../socket.js'
import { finishSession } from '../../game/sessionManager.js'
import { asyncHandler } from '../../middleware/error.js'

const commandCompleteCallbacks = new Map()

export const newCommand = asyncHandler(async (req, res) => {
  const { command, pwd, output, error, params } = matchedData(req)

  const { sessionId } = req.user
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

  const commandHandler = new CommandHandler(session, c, params)
  const response = await commandHandler.run()
  if (response) {
    c.stage = response.stage
    await c.save()

    if (response.stage === 'END') {
      await finishSession(session)
    }
    commandCompleteCallbacks.set(session.id, response.callback)
    pushToSession(session.id, 'status', 'pending')
  }

  res.status(201).json(response)
  await session.save()
})

export const completedCommand = asyncHandler(async (req, res) => {
  const { sessionId } = req.user

  const session = await Session.findById(sessionId)

  if (!session) {
    res.status(404).json({ message: 'session not found' })
    return
  }

  if (session.status === 'inactive') {
    res.status(400).json({ message: 'session is not active' })
    return
  }

  const callback = commandCompleteCallbacks.get(session.id)
  if (!callback) {
    res.status(400).json({ message: 'no callback found' })
    return
  }
  callback()
  commandCompleteCallbacks.delete(session.id)
  res.json({ message: 'ok' })
})
