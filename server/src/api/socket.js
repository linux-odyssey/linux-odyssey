import { Server } from 'socket.io'
import { getAndStartContainer, attachContainer } from '../containers/docker.js'
import Session from '../models/session.js'
import { defaultUser, genSessionJWT } from '../utils/auth.js'

const sessions = new Map()

function listenToSession(sessionId, event, callback) {
  const callbacks = sessions.get((sessionId, event)) || []
  sessions.set((sessionId, event), callbacks.concat(callback))
}

function removeFromSession(sessionId, event, callback) {
  const callbacks = sessions.get((sessionId, event)) || []
  sessions.set(
    (sessionId, event),
    callbacks.filter((cb) => cb !== callback)
  )
}

export function pushToSession(sessionId, event, data) {
  console.log('Push:', sessionId, event)
  const callbacks = sessions.get((sessionId, event))
  console.debug('Callbacks:', sessionId, callbacks.length)
  if (callbacks) {
    callbacks.forEach((callback) => callback(data))
  }
}

export default (server) => {
  const io = new Server(server)

  io.use(async (socket, next) => {
    console.log('Authenticating...')
    try {
      const user = await defaultUser()
      // eslint-disable-next-line no-param-reassign
      socket.user = user
      next()
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

  io.on('connection', async (socket) => {
    console.log('Connected to the client.')
    const sessionId = socket.handshake.query.session_id
    if (!sessionId) {
      socket.send('Session ID not found.')
      socket.disconnect()
      return
    }
    let session
    try {
      session = await Session.findOne({
        _id: sessionId,
        user: socket.user,
        status: 'active',
      })
      if (!session) {
        socket.send('Session not found.')
        socket.disconnect()
        return
      }
    } catch (err) {
      socket.send(err.message)
      socket.disconnect()
      return
    }

    const token = await genSessionJWT(session)

    const container = await getAndStartContainer(session.containerId)
    const stream = await attachContainer(container, { token })

    stream.socket.on('data', (chunk) => {
      socket.emit('terminal', chunk.toString())
    })

    socket.on('message', console.log)

    socket.on('terminal', function incoming(message) {
      stream.socket.write(message)
    })

    const graphCallback = (data) => {
      socket.emit('graph', data)
    }

    listenToSession(session.id, 'graph', graphCallback)

    socket.on('disconnect', () => {
      console.log('Disconnected from the client.')
      stream.socket.write('exit\n')
      removeFromSession(session.id, 'graph', graphCallback)
      stream.destroy()
    })

    listenToSession(session.id, 'hint', (data) => {
      socket.emit('hint', data)
    })

    socket.send(`${container.id}\n`)
  })
}
