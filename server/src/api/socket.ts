import { Server } from 'socket.io'
import type { Socket } from 'socket.io'
import validator from 'validator'
import type { Server as HttpServer } from 'http'
import { Session } from '../../../packages/models'
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

async function onConnect(socket: Socket) {
  const user = (socket.request as any).session?.passport?.user
  if (!user) {
    socket.emit('error', 'User not found.')
    socket.disconnect()
    return
  }
  const { sessionId } = socket.handshake.query
  if (
    !sessionId ||
    typeof sessionId !== 'string' ||
    !validator.isMongoId(sessionId)
  ) {
    logger.warn('Invalid Session ID.', user.username, sessionId)
    socket.emit('error', 'Invalid Session ID.')
    socket.disconnect()
    return
  }

  const session = await Session.findById(sessionId)
  if (!session) {
    socket.emit('error', 'Session not found.')
    socket.disconnect()
    return
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

  io.on('connection', onConnect)
  io.on('connect_error', (err) => {
    logger.error('Socket connect error: ', err)
  })
}
