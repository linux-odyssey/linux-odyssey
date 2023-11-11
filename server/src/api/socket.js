import { Server } from 'socket.io'
import validator from 'validator'
import { Session } from '@linux-odyssey/models'
import { getAndStartContainer, attachContainer } from '../containers/docker.js'
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

async function connectContainer(socket, next) {
  console.log(next)
  const user = socket.request.session?.passport?.user
  // console.log(user)
  if (!user) {
    next(new Error('User not found.'))
    return
  }
  // console.log(socket.handshake)
  const { sessionId } = socket.handshake.query
  if (!(sessionId && validator.isMongoId(sessionId))) {
    console.warn('Invalid Session ID.', sessionId)
    next(new Error('Invalid Session ID.'))
    return
  }

  const session = await Session.findById(sessionId)
  if (!session) {
    next(new Error('Session not found.'))
    return
  }

  const token = await genJWT({
    sessionId: session.id,
  })

  try {
    const container = await getAndStartContainer(session.containerId)
    const stream = await attachContainer(container, { token })
    socket.context = {
      session,
      stream,
    }
    next()
  } catch (err) {
    next(new Error('Failed to start container.'))
  }
}

function onConnect(socket) {
  const { session, stream } = socket.context
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
}

export default (server) => {
  const io = new Server(server)

  io.engine.use(SessionMiddleware)
  io.use(connectContainer)

  io.on('connection', onConnect)
  io.on('connect_error', (err) => {
    console.error(err)
  })
}
