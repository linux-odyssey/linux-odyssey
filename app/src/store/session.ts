import { defineStore } from 'pinia'
import { FileGraph, FileObject } from '@linux-odyssey/file-graph'
import { IQuest } from '@linux-odyssey/models'
import { createSession, getActiveSession, getQuest } from '../utils/api'
import Socket from '../utils/socket'
import SocketTerminal from '../utils/terminal'
import { Session, StageResponse } from '../types'

const socket = new Socket()
const term = new SocketTerminal(40, 80)
let hasSetup = false

interface Store {
  session: Session | null
  questId: string
  quest: IQuest | null
}

const useSession = defineStore('session', {
  state: (): Store => ({
    session: null,
    questId: '',
    quest: null,
  }),
  actions: {
    async setQuest(questId: string) {
      this.quest = await getQuest(questId)
      this.questId = questId
    },
    async setSession(session: Session) {
      this.session = session
      this.session.graph = new FileGraph(session.graph)
      term.reset()
      await socket.connect(session)
      term.focus()
    },
    async createSession() {
      const session = await createSession(this.questId)
      await this.setSession(session)
      socket.emit('terminal', 'echo start\n')
    },
    async getActiveSession() {
      const session = await getActiveSession(this.questId)
      if (session) {
        this.setSession(session)
      }
    },
    updateGraph(event: { discover?: FileObject[]; pwd?: string }) {
      if (!this.session) return
      if (event.discover) {
        this.session.graph.discover(event.discover)
      }
      if (event.pwd) {
        this.session.pwd = event.pwd
      }
    },
    newResponse(response: StageResponse) {
      if (!this.session) return
      this.session.responses.push(response.responses)
      this.session.hints.push(response.hints)
      this.session.tasks = response.tasks
      this.session.status = response.status
    },
    reset() {
      socket.reset()
      term.reset()
      this.$reset()
    },
    setup() {
      if (hasSetup) return
      socket.on('terminal', (data: string) => {
        term.write(data)
      })
      term.onData((data: string) => {
        socket.emit('terminal', data)
      })
      socket.on('graph', (event: { discover: FileObject[]; pwd: string }) => {
        this.updateGraph(event)
      })
      socket.on('response', (response: StageResponse) => {
        this.newResponse(response)
      })
      hasSetup = true
    },
    setStatus(status: string) {
      if (!this.session) return
      this.session.status = status
    },
  },
})

export function useTerminal() {
  return term
}

// export async function init(questId: string) {
//   if (!questId) throw new Error('No quest ID provided')
// reset()
// try {
//   await setQuest(questId)
// } catch (err) {
//   console.error(err)
//   throw new LoadQuestError('Failed to load quest', questId)
// }
//   try {
//     await getActiveSession(questId)
//   } catch (err) {
//     console.error(err)
//     throw new LoadSessionError('Failed to load session', questId)
//   }
// }

export default useSession
