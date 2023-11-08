import { reactive } from 'vue'
import { FileGraph } from '@linux-odyssey/file-graph'
import api from '../utils/api'
import Socket from '../utils/socket'
import SocketTerminal from '../utils/terminal'

function newSession() {
  return {
    status: 'inactive',
    graph: new FileGraph({
      path: '/',
      type: 'folder',
      discovered: false,
    }),
    pwd: '',
    hints: [],
    tasks: [],
  }
}

const store = reactive({
  session: newSession(),
  questId: '',
})

const socket = new Socket()
const term = new SocketTerminal(40, 80)

async function setSession(session) {
  store.session = session
  store.session.graph = new FileGraph(session.graph)
  term.reset()
  await socket.connect(session)
  term.focus()
}

export async function createSession() {
  console.log('Creating a new session...')
  const res = await api.post('/sessions', { quest_id: this.questId })
  const { data } = res
  setSession(data)
}

async function getActiveSession() {
  const res = await api.post('/sessions/active', {
    quest_id: store.questId,
  })
  const session = res.data
  try {
    await setSession(session)
  } catch (err) {
    console.log(err)
    createSession().catch(console.error)
  }
}

function updateGraph(event) {
  if (event.discover) {
    store.session.graph.discover(event.discover)
  }
  if (event.pwd) {
    store.session.pwd = event.pwd
  }
}

function updateHints(hints) {
  store.session.hints.push(hints)
}

function updateStatus(status) {
  store.session.status = status
}

function setTasks(tasks) {
  store.session.tasks = tasks
}

export function useTerminal() {
  return term
}

export function init(questId) {
  store.questId = questId
  socket.reset()
  socket.on('terminal', (data) => {
    term.write(data)
  })
  term.onData((data) => {
    socket.emit('terminal', data)
  })
  socket.on('graph', (event) => {
    updateGraph(event)
  })
  socket.on('hints', (event) => {
    updateHints(event)
  })
  socket.on('tasks', (tasks) => {
    setTasks(tasks)
  })
  socket.on('status', (event) => {
    updateStatus(event)
  })
  return getActiveSession()
}

export function reset() {
  socket.reset()
  store.session = newSession()
}

export default store
