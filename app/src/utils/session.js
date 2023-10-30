import { ref } from 'vue'
import { FileGraph } from '@linux-odyssey/file-graph'
import api from './api'
import Socket from './socket'
import SocketTerminal from './terminal'

class SessionManager {
  constructor(questId) {
    this.questId = questId
    this.session = ref(null)
    this.hints = ref([])
    this.graph = ref(
      new FileGraph({
        path: '/',
        type: 'folder',
        discovered: false,
      })
    )
    this.pwd = ref('')
    this.status = ref('inactive')
    this.socket = new Socket()
    this.term = new SocketTerminal(40, 80)
  }

  init() {
    this.socket.on('terminal', (data) => {
      this.term.write(data)
    })
    this.term.onData((data) => {
      this.socket.emit('terminal', data)
    })
    this.socket.on('graph', (event) => {
      this.handleGraphUpdate(event)
    })
    this.socket.on('hints', (event) => {
      this.handleHintUpdate(event)
    })
    this.socket.on('tasks', (tasks) => {
      this.setTasks(tasks)
    })
    this.socket.on('status', (event) => {
      this.handleStatusUpdate(event)
    })
    return this.getActiveSession()
  }

  getSession() {
    return this.session.value
  }

  setSession(session) {
    this.session.value = session
    this.graph.value = new FileGraph(session.graph)
    this.hints.value = session.hints
    this.status.value = session.status
    this.term.clear()
    this.socket.connect(session)
  }

  handleGraphUpdate(event) {
    if (event.discover) {
      this.graph.value.discover(event.discover)
    }
    if (event.pwd) {
      this.pwd.value = event.pwd
    }
  }

  handleHintUpdate(hints) {
    this.hints.value = [...this.hints.value, ...hints]
  }

  handleStatusUpdate(status) {
    this.status.value = status
  }

  setTasks(tasks) {
    this.session.value.tasks = tasks
  }

  async createSession() {
    console.log('Creating a new session...')
    const res = await api.post('/sessions', { quest_id: this.questId })
    const { data } = res
    console.log('Created Session ID:', data._id)
    this.setSession(data)
  }

  async getActiveSession() {
    const res = await api.post('/sessions/active', {
      quest_id: this.questId,
    })
    const session = res.data
    console.log(session)
    this.setSession(session)
  }
}

const sessionManager = new SessionManager('helloworld')

export default sessionManager
