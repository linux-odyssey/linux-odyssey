import { Server } from 'socket.io'
import { getAndStartContainer, attachContainer } from '../containers/docker.js'
import Session from '../models/session.js'
import { defaultUser, genSessionJWT } from '../utils/auth.js'

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

  const socketCallback = (event, ...data) => {
    socket.emit(event, ...data)
  }

  listenToSession(session.id, socketCallback)

  socket.on('disconnect', () => {
    console.log('Disconnected from the client.')
    stream.socket.write('exit\n')
    removeFromSession(session.id, socketCallback)
    stream.destroy()
  })

  socket.send(`${container.id}\n`)
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

    stream.on('data', (chunk) => {
      socket.emit('terminal', chunk.toString())
    })

    socket.on('message', console.log)

    socket.on('hint', function hints(message) {
      stream.write(message)
    })

    socket.on('terminal', function incoming(message) {
      stream.write(message)
    })

    socket.on('close', () => {
      console.log('Disconnected from the client.')
    })

    listenToSession(session.id, 'graph', (data) => {
      socket.emit('graph', data)
    })

    listenToSession(session.id, 'hint', (data) => {
      socket.emit('hint', data)
    })

    socket.send(`${container.id}\n`)
  })
}
