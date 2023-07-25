/* eslint-disable no-underscore-dangle */
import { stdin, stdout, exit } from 'process'
import { io } from 'socket.io-client'
import { get } from './utils/env.js'

const API_ENDPOINT = get('API_ENDPOINT', 'http://localhost:3000')

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

async function getSessionId() {
  const res = await fetch(`${API_ENDPOINT}/api/v1/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quest_id: 'helloworld',
    }),
  })
  const data = await res.json()
  return data._id
}

async function main() {
  const sessionId = process.argv[2] || (await getSessionId())
  console.log(`Session ID: ${sessionId}`)
  if (!sessionId) exit()

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
    if (key === '\u0004') {
      socket.close()
      exit()
    } else {
      socket.send(key)
    }
  })
}

main()
