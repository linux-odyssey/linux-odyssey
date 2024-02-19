import { Server } from 'socket.io'
import type { Socket } from 'socket.io'
import validator from 'validator'
import type { Server as HttpServer } from 'http'
import { Session } from '@linux-odyssey/models'
import { getAndStartContainer, attachContainer } from '../containers/docker.js'
import SessionMiddleware from '../middleware/session.js'
import { genJWT } from '../utils/auth.js'
import logger from '../utils/logger.js'

// eslint-disable-next-line no-unused-vars
type SocketCallback = (event: string, ...args: any[]) => void

const sessions = new Map<string, SocketCallback[]>()

function listenToSession(sessionId: string, callback: SocketCallback) {
  const callbacks = sessions.get(sessionId) || []
  sessions.set(sessionId, callbacks.concat(callback))
}

function removeFromSession(sessionId: string, callback: SocketCallback) {
  const callbacks = sessions.get(sessionId) || []
  sessions.set(
    sessionId,
    callbacks.filter((cb) => cb !== callback)
  )
}

export function pushToSession(
  sessionId: string,
  event: string,
  ...args: any[]
) {
  const callbacks = sessions.get(sessionId)
  if (callbacks) {
    callbacks.forEach((callback) => callback(event, ...args))
  }
}

// eslint-disable-next-line no-unused-vars
async function connectContainer(socket: Socket, next: (err?: Error) => void) {
  const user = (socket.request as any).session?.passport?.user
  if (!user) {
    next(new Error('User not found.'))
    return
  }
  // console.log(socket.handshake)
  const { sessionId } = socket.handshake.query
  if (
    !sessionId ||
    typeof sessionId !== 'string' ||
    !validator.isMongoId(sessionId)
  ) {
    logger.warn('Invalid Session ID.', user.username, sessionId)
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

  if (!session.containerId) {
    next(new Error('Session has no container.'))
    return
  }

  try {
    const container = await getAndStartContainer(session.containerId)
    const stream = await attachContainer(container, { token })
    socket.data.context = {
      session,
      stream,
    }
    next()
  } catch (err) {
    next(new Error('Failed to start container.'))
  }
}

function onConnect(socket: Socket) {
  const { session, stream } = socket.data.context
  stream.socket.on('data', (chunk: Buffer) => {
    socket.emit('terminal', chunk.toString())
  })

  socket.on('terminal', function incoming(message) {
    stream.socket.write(message)
  })

  const socketCallback = (event: string, ...data: any[]) => {
    socket.emit(event, ...data)
  }

  listenToSession(session.id, socketCallback)

  socket.on('disconnect', () => {
    stream.socket.write('exit\n')
    removeFromSession(session.id, socketCallback)
    stream.destroy()
  })
}

export default (server: HttpServer) => {
  const io = new Server(server)

  io.engine.use(SessionMiddleware)
  io.use(connectContainer)

  io.on('connection', onConnect)
  io.on('connect_error', (err) => {
    logger.error('Socket connect error: ', err)
  })
}
