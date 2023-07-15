import readline from 'readline'
import { exit } from 'process'
import { io } from 'socket.io-client'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const socket = io('ws://localhost:8080')

socket.on('open', function open() {
  console.log('Connected to the server.')
})

socket.on('message', function incoming(data) {
  console.log(`From server: ${data}`)
})

socket.on('close', function close() {
  console.log('Disconnected from the server.')
  exit()
})

rl.on('line', (input) => {
  socket.send(input)
})
