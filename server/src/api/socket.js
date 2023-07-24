import { Server } from 'socket.io'
import { getOrCreateContainer, attachContainer } from '../utils/docker.js'
import Session from '../models/session.js'
import { defaultUser } from '../utils/auth.js'

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
    const session = await Session.findOne({
      _id: socket.handshake.query.session_id,
      user: socket.user,
    })

    if (!session) {
      socket.send('Session not found.')
      socket.disconnect()
      return
    }

    const container = await getOrCreateContainer(session.containerId)
    const stream = await attachContainer(container)

    stream.on('data', (chunk) => {
      socket.send(chunk)
    })

    socket.on('message', function incoming(message) {
      console.log(`From client: ${message}`)
      stream.write(message)
    })

    socket.on('close', () => {
      console.log('Disconnected from the client.')
    })

    socket.send(`${container.id}\n`)
  })
}
