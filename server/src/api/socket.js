import { Server } from 'socket.io'
import { getAndStartContainer, attachContainer } from '../containers/docker.js'
import Session from '../models/session.js'
import SessionMiddleware from '../middleware/session.js'
import { genJWT } from '../utils/auth.js'

const sessions = new Map()

function listenToSession(sessionId, callback) {
  const callbacks = sessions.get(sessionId) || []
  sessions.set(sessionId, callbacks.concat(callback))
}

function removeFromSession(sessionId, event, callback) {
  const callbacks = sessions.get((sessionId, event)) || []
  sessions.set(
    (sessionId, event),
    callbacks.filter((cb) => cb !== callback)
  )
}

export function pushToSession(sessionId, event, ...args) {
  const callbacks = sessions.get(sessionId)
  if (callbacks) {
    callbacks.forEach((callback) => callback(event, ...args))
  }
}

async function connectClient(socket) {
  const user = socket.request.session?.passport?.user
  if (!user) {
    socket.send('User not found.')
    socket.disconnect()
    return
  }
  const sessionId = socket.handshake.query.session_id
  if (!sessionId) {
    socket.send('Session ID not found.')
    socket.disconnect()
    return
  }

  const session = await Session.findOne({
    _id: sessionId,
    user,
    status: 'active',
  })
  if (!session) {
    socket.send('Session not found.')
    socket.disconnect()
    return
  }

  const token = await genJWT({
    session_id: session.id,
  })

  let container
  let stream
  try {
    container = await getAndStartContainer(session.containerId)
    stream = await attachContainer(container, { token })
  } catch (err) {
    socket.send(err.message)
    socket.disconnect()
    return
  }

  stream.socket.on('data', (chunk) => {
    socket.emit('terminal', chunk.toString())
  })

  socket.on('message', console.log)

  socket.on('terminal', function incoming(message) {
    stream.socket.write(message)
  })

  const socketCallback = (event, ...data) => {
    socket.emit(event, ...data)
  }

  listenToSession(session.id, socketCallback)

  socket.on('disconnect', () => {
    stream.socket.write('exit\n')
    removeFromSession(session.id, socketCallback)
    stream.destroy()
  })

  socket.send(`${container.id}\n`)
}

export default (server) => {
  const io = new Server(server)

  io.engine.use(SessionMiddleware)

  io.on('connection', connectClient)
}
