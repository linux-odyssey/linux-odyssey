import { Server } from 'socket.io'
import { getOrCreateContainer, attachContainer } from '../utils/docker.js'
import Session from '../models/session.js'
import { defaultUser, genSessionJWT } from '../utils/auth.js'

export default (server) => {
  const io = new Server(
    server,
    {
      cors: {
        origin: '*',
      },
    },
    {
      cors: {
        origin: '*',
      },
    }
  )
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

    const container = await getOrCreateContainer(session.containerId)
    const stream = await attachContainer(container, { token })

    stream.on('data', (chunk) => {
      socket.send(chunk.toString().toString())
    })

    socket.on('message', function incoming(message) {
      stream.write(message)
    })

    socket.on('close', () => {
      console.log('Disconnected from the client.')
    })

    socket.send(`${container.id}\n`)
  })
}
