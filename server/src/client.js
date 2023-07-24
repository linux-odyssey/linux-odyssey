import { stdin, stdout, exit } from 'process'
import { io } from 'socket.io-client'

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

const sessionId = process.argv[2]
console.log(`Session ID: ${sessionId}`)

const socket = io('ws://localhost:3000', {
  query: {
    session_id: sessionId,
  },
})

socket.on('open', function open() {
  console.log('Connected to the server.')
})

socket.on('message', function incoming(data) {
  stdout.write(data)
})

socket.on('close', function close() {
  console.log('Disconnected from the server.')
  exit()
})

stdin.on('data', (key) => {
  if (key === '\u0003') {
    socket.close()
    exit()
  } else {
    socket.send(key)
  }
})
