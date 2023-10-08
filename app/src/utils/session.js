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
  }

  getSession() {
    return this.session.value
  }

  setSession(session) {
    console.log('Update session:', session)
    this.session.value = session
    this.graph.value = new FileGraph(session.graph)
    this.hints.value = session.hints
  }

  handleGraphUpdate(event) {
    if (event.discover) {
      this.graph.value = this.graph.value.discover(event.discover)
    }
    if (event.pwd) {
      this.pwd.value = event.pwd
    }
  }

  handleHintUpdate(event) {
    this.hints.value = [...this.hints.value, ...event]
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

  async getSessionList() {
    const res = await api.get('/sessions', {
      params: { quest_id: this.questId },
    })
    const { data } = res
    return data
  }

  async lastSession() {
    const sessions = await this.getSessionList()
    if (sessions.length === 0) {
      return
    }
    const { _id: sessionId } = sessions[sessions.length - 1]
    const { data: session } = await api.get(`/sessions/${sessionId}`)
    console.log(
      `Last Session ID: ${session._id}, Quest: ${session.quest}, Created At: ${session.createdAt}`
    )
    this.setSession(session)
  }

  async lastOrCreate() {
    await this.lastSession()
    if (!this.session.value) {
      await this.createSession()
    }
    console.log(this.session.value)
  }
}

const sessionManager = new SessionManager('helloworld')

export default sessionManager
