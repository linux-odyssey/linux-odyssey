import { Server } from 'socket.io'
import { getOrCreateContainer, attachContainer } from '../utils/docker.js'

export default (server) => {
  const io = new Server(server)

  io.on('connection', async (socket) => {
    console.log('Connected to the client.')
    const container = await getOrCreateContainer('odyssey-test')
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
