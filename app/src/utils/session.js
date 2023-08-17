import api from './api'

class SessionManager {
  constructor(questId) {
    this.questId = questId
  }

  async createdSession() {
    console.log('Creating a new session...')
    const res = await api.post('/sessions', { quest_id: this.questId })
    const { data } = res
    console.log('Created Session ID:', data._id)
    return data
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
      return null
    }
    const session = sessions[sessions.length - 1]
    console.log(
      `Last Session ID: ${session._id}, Quest: ${session.quest}, Created At: ${session.createdAt}`
    )
    return session
  }

  async latestOrCreate() {
    return (await this.lastSession()) || this.createdSession()
  }
}

const sessionManager = new SessionManager('helloworld')

export default sessionManager
