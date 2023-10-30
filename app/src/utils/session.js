import { ref } from 'vue'
import { FileGraph } from '@linux-odyssey/file-graph'
import api from './api'

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
  }

  getSession() {
    return this.session.value
  }

  setSession(session) {
    this.session.value = session
    this.graph.value = new FileGraph(session.graph)
    this.hints.value = session.hints
    this.status.value = session.status
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
