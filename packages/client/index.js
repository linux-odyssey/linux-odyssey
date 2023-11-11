/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import { stdin, stdout, exit } from 'process'
import { io } from 'socket.io-client'
import { program } from 'commander'

let api = null
const COOKIE_NAME = 'connect.sid'

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

function debug(...args) {
  if (program.opts().debug) {
    console.debug(...args)
  }
}

async function createSession() {
  console.log('Creating a new session...')
  const res = await api.post('/sessions', {
    questId: 'helloworld',
  })
  const { data } = await res
  if (!data._id) {
    console.error(data)
    exit(1)
  }
  console.log('Created Session ID:', data._id)
  return data
}

async function getSessionList() {
  const res = await api.get('/sessions')
  return res.data
}

async function lastSession() {
  const sessions = await getSessionList()
  if (sessions.length === 0) {
    console.log(
      'No session found. Please use --create to create a new session.'
    )
    return null
  }
  const session = sessions[sessions.length - 1]
  console.log(
    `Last Session ID: ${session._id}, Quest: ${session.quest}, Created At: ${session.createdAt}`
  )
  return session
}

async function connect(sessionId, cookie) {
  console.log(`Session ID: ${sessionId}`)
  console.log('Use Ctrl + D to exit.')
  if (!sessionId) exit()

  const socket = io(program.opts().host, {
    extraHeaders: {
      Cookie: cookie,
    },
    query: {
      sessionId,
    },
  })

  socket.on('connection', function open() {
    console.log('Connected to the server.')
  })

  socket.on('connect_error', (err) => {
    console.error(err)
    exit(1)
  })

  socket.on('message', console.log)

  socket.on('terminal', function incoming(data) {
    stdout.write(data)
  })

  socket.on('graph', (data) => {
    debug('receive graph:', data)
  })

  socket.on('hints', (data) => {
    debug('receive hints:', data)
  })

  socket.on('tasks', (data) => {
    debug('receive tasks:', data)
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

async function login() {
  try {
    const res = await api.post('/auth/login', {
      username: program.opts().user,
      password: program.opts().password,
    })
    console.log('Login success.')
    return res.headers['set-cookie'].find((cookie) =>
      cookie.startsWith(COOKIE_NAME)
    )
  } catch (err) {
    console.log('Login failed.')
    console.error(err.message)
    return exit(1)
  }
}

async function main() {
  api = axios.create({
    baseURL: `${program.opts().host}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

  try {
    const cookie = await login()
    api.defaults.headers.Cookie = cookie
    const sessionId =
      program.opts().session ||
      (program.opts().create && (await createSession())?._id) ||
      (await lastSession())?._id ||
      (await createSession())?._id

    await connect(sessionId, cookie)
  } catch (err) {
    console.error(err.message)
    exit(1)
  }
}

program
  .option('-s, --session <string>', 'Session ID')
  .option('-c, --create', 'Create a new session')
  .option('-d, --debug', 'Debug mode')
  .option('-u, --user <string>', 'Username', get('USERNAME', 'alex'))
  .option('-p, --password <string>', 'Password', get('PASSWORD', '123456'))
  .option(
    '-h, --host <string>',
    'Server host',
    get('API_ENDPOINT', 'http://localhost:3000')
  )
  .action(main)

program.parse()
