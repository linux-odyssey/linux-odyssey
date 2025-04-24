import { defineStore } from 'pinia'
import { FileGraph, FileGraphUpdateEvent } from '@linux-odyssey/file-graph'
import { IResponse, ITask } from '@linux-odyssey/game'
import type { SessionDetail } from 'server/src/routers/sessionRouter'
import Socket from '../utils/socket'
import SocketTerminal from '../utils/terminal'
import { Session } from '../types'
import { trpc } from '../utils/trpc'

const socket = new Socket()
const term = new SocketTerminal(40, 80)
let hasSetup = false

interface QuestDetailResponse {
  id: string
  title: string
  instruction: string
  requirements: string[]
}

interface SessionUpdate {
  status: string
  responses: IResponse[]
  tasks: ITask[]
  graphUpdate: FileGraphUpdateEvent
}

interface Store {
  session: Session | null
  questId: string
  quest: QuestDetailResponse | null
}

const useSession = defineStore('session', {
  state: (): Store => ({
    session: null,
    questId: '',
    quest: null,
  }),
  actions: {
    async setQuest(questId: string) {
      this.quest = await trpc.quests.getQuestDetail.query(questId)
      this.questId = questId
    },
    async setSession(session: SessionDetail) {
      console.log('set session', session)
      this.session = {
        ...session,
        graph: new FileGraph(session.graph),
      }
      term.reset()
      await socket.connect(this.session)
      term.focus()
    },
    async createSession() {
      const session = await trpc.session.createSession.mutate({
        questId: this.questId,
      })
      await this.setSession(session)
      socket.emit('terminal', 'echo start\n')
    },
    async getActiveSession() {
      const session = await trpc.session.getActiveSession.query({
        questId: this.questId,
      })
      if (session) {
        this.setSession(session)
      }
    },
    newUpdate(update: SessionUpdate) {
      if (!this.session) return
      this.session.responses = update.responses
      this.session.tasks = update.tasks
      this.session.status = update.status
      if (update.graphUpdate) {
        this.session.graph.handleEvent(update.graphUpdate)
      }
      // if (
      //   response.status === 'finished' &&
      //   this.session.status !== 'finished'
      // ) {
      //   this.finish()
      // }
      // this.session.status = response.status
    },
    finish() {
      if (!this.session) return
      this.session.status = 'finished'
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
      // socket.on('graph', (event: { discover: FileObject[]; pwd: string }) => {
      //   this.updateGraph(event)
      // })
      socket.on('update', (update: SessionUpdate) => {
        this.newUpdate(update)
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

export default useSession
