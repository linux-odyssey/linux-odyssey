/* eslint-disable import/prefer-default-export */
import Command from '../../models/command.js'
import Session from '../../models/session.js'
import { verifySessionJWT } from '../../utils/auth.js'

export async function newCommand(req, res) {
  const { token, command, pwd, output } = req.body

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
    output,
  })

  await c.save()

  res.status(201).end()
}
