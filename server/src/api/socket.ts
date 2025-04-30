import { Server } from 'socket.io'
import type { Socket } from 'socket.io'
import validator from 'validator'
import type { Server as HttpServer } from 'http'
import { ISession, Session } from '../../../packages/models'
import SessionMiddleware from '../middleware/session.js'
import logger from '../utils/logger.js'

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

  socket.data.context = {
    session,
  }
  next()
}

function onConnect(socket: Socket) {
  const { session } = socket.data.context as {
    session: ISession
  }

  const socketCallback = (event: string, ...data: any[]) => {
    socket.emit(event, ...data)
  }

  listenToSession(session._id.toString(), socketCallback)

  socket.on('disconnect', () => {
    removeFromSession(session._id.toString(), socketCallback)
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
