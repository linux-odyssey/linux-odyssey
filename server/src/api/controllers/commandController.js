/* eslint-disable import/prefer-default-export */
import Command from '../../models/command.js'
import Session from '../../models/session.js'
import { verifySessionJWT } from '../../utils/auth.js'
import CommandHandler from '../../game/commandHandler.js'

export async function newCommand(req, res) {
  console.log('new command:', req.body)
  const { token, command, pwd, output, error, ...additionalData } = req.body

  if (!command) {
    res.status(400).json({ message: 'command is required' })
    return
  }

  let sessionId
  try {
    const decoded = await verifySessionJWT(token)
    sessionId = decoded.session_id
  } catch (err) {
    res.status(401).json({ message: 'token not valid' })
    return
  }

  const session = await Session.findById(sessionId)

  if (!session) {
    res.status(404).json({ message: 'session not found' })
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

  const commandHandler = new CommandHandler(session, c, additionalData)

  const response = await commandHandler.run()

  res.status(201).json(response)
  await session.save()
}
