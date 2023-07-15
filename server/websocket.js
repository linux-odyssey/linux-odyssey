import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws) {
  console.log('Connected to the client.')

  ws.on('message', function incoming(message) {
    console.log(`From client: ${message}`)
  })

  ws.send('Hello from server!')
})
