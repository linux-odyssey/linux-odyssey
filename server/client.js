import { stdin, stdout, exit } from 'process'
import { io } from 'socket.io-client'
import { Writable } from 'stream'
import { pipeline } from 'stream/promises'

console.log(stdin)
console.log(process.stdin.isTTY)
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

const socket = io('ws://localhost:8080')

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
