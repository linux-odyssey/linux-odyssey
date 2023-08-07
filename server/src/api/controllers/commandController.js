/* eslint-disable import/prefer-default-export */
import Command from '../../models/command.js'
import Session from '../../models/session.js'
import { verifySessionJWT } from '../../utils/auth.js'

export async function newCommand(req, res) {
  console.log('new command:', req.body)
  const { token, command, pwd, exit_code, output } = req.body

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
    res.status(401).json({ message: 'session not found' })
    return
  }

  const c = new Command({
    session,
    command,
    pwd,
    exit_code,
    output,
  })

  await c.save()

  res.status(201).json({
    responses: ['Hello, world!', 'How are you?'],
  })
}
