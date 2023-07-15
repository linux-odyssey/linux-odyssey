import WebSocket from 'ws'
import readline from 'readline'
import { exit } from 'process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ws = new WebSocket('ws://localhost:8080')

ws.on('open', function open() {
  console.log('Connected to the server.')
})

ws.on('message', function incoming(data) {
  console.log(`From server: ${data}`)
})

ws.on('close', function close() {
  console.log('Disconnected from the server.')
  exit()
})

rl.on('line', (input) => {
  ws.send(input)
})
