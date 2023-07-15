import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Connected to the client.')

  socket.on('message', function incoming(message) {
    console.log(`From client: ${message}`)
  })

  socket.on('close', () => {
    console.log('Disconnected from the client.')
  })

  socket.send('Hello from server!')
})

server.listen(8080, () => {
  console.log(`Server listening at http://localhost:8080`)
})
