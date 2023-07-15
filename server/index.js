import express from 'express'
import http from 'http'
import socketServer from './socket.js'

const port = 3000
const app = express()
const server = http.createServer(app)
socketServer(server)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
