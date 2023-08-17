import { ref } from 'vue'
import api from './api'

class SessionManager {
  constructor(questId) {
    this.questId = questId
    this.session = ref(null)
  }

  setSession(session) {
    console.log('Update session:', session)
    this.session.value = session
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
    const session = sessions[sessions.length - 1]
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
  }
}

const sessionManager = new SessionManager('helloworld')

sessionManager.lastOrCreate().catch(console.error)

export default sessionManager
