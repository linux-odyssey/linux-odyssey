/* eslint-disable no-underscore-dangle */
import { stdin, stdout, exit } from 'process'
import { io } from 'socket.io-client'
import { program } from 'commander'

function get(key, defaultValue) {
  const value = process.env[key]
  if (value != null) {
    return value
  }
  return defaultValue
}
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

async function createdSession() {
  console.log('Creating a new session...')
  const res = await fetch(`${program.opts().host}/api/v1/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quest_id: 'helloworld',
    }),
  })
  const data = await res.json()
  console.log('Created Session ID:', data._id)
  return data
}

async function getSessionList() {
  const res = await fetch(`${program.opts().host}/api/v1/sessions`)
  const data = await res.json()
  return data
}

async function lastSession() {
  const sessions = await getSessionList()
  if (sessions.length === 0) {
    console.log(
      'No session found. Please use --create to create a new session.'
    )
    exit(1)
  }
  const session = sessions[sessions.length - 1]
  console.log(
    `Last Session ID: ${session._id}, Quest: ${session.quest}, Created At: ${session.createdAt}`
  )
  return session
}

async function connect(sessionId) {
  console.log(`Session ID: ${sessionId}`)
  console.log('Use Ctrl + D to exit.')
  if (!sessionId) exit()

  const socket = io(program.opts().host, {
    query: {
      session_id: sessionId,
    },
  })

  socket.on('open', function open() {
    console.log('Connected to the server.')
  })

  socket.on('message', console.log)

  socket.on('terminal', function incoming(data) {
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
      socket.emit('terminal', key)
    }
  })
}

async function main() {
  console.log(program.opts().session)
  // main()

  const sessionId =
    program.opts().session ||
    (program.opts().create ? (await createdSession())._id : null) ||
    (await lastSession())._id

  await connect(sessionId)
}

program
  .option('-s, --session <string>', 'Session ID')
  .option('-c, --create', 'Create a new session')
  .option(
    '-h, --host <string>',
    'Server host',
    get('API_ENDPOINT', 'http://localhost:3000')
  )
  .action(main)

program
  .command('list')
  .description('List all sessions')
  .action(async () => {
    const sessions = await getSessionList()
    sessions.forEach(({ _id, quest, createdAt }) => {
      console.log(`${_id} ${quest} ${createdAt}`)
    })
    exit()
  })

program.parse()
