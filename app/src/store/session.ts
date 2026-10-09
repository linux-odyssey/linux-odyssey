import { defineStore } from 'pinia'
import type { QuestLocale } from '../../../packages/constants'
import {
  FileGraph,
  type FileGraphUpdateEvent,
} from '../../../packages/file-graph'
import type { IResponse, ITask } from '../../../packages/game'
import type { SessionDetail } from '../../../server/src/routers/sessionRouter'
import Socket from '../utils/socket'
import SocketTerminal from '../utils/terminal'
import type { Session } from '../types'
import { trpc } from '../utils/trpc'
import { i18n } from '../i18n'

const socket = new Socket()
const term = new SocketTerminal()
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

export const useSession = defineStore('session', {
  state: (): Store => ({
    session: null,
    questId: '',
    quest: null,
  }),
  actions: {
    async setQuest(questId: string, locale: QuestLocale) {
      this.quest = await trpc.quests.getQuestDetail.query({
        questId,
        locale,
      })
      this.questId = questId
    },
    async setSession(session: SessionDetail) {
      await this.setQuest(session.quest, session.locale)

      this.session = {
        ...session,
        graph: new FileGraph(session.graph),
        pwd: '/home/commander',
        containerName: session.containerName || '',
      }
      term.reset()
      await socket.connect(this.session)
      await term.connect(
        `/terminal/${session.containerName}/ws?token=${session.token}`
      )
      term.focus()
    },
    async createSession() {
      const locale = i18n.global.locale.value
      const session = await trpc.session.createSession.mutate({
        questId: this.questId,
        locale,
      })
      await this.setSession(session)
      term.send('echo start\n')
    },
    async getActiveSession(questId: string) {
      const session = await trpc.session.getActiveSession.query({ questId })
      if (session) {
        await this.setSession(session)
      }
    },
    newUpdate(update: SessionUpdate) {
      if (!this.session) return
      this.session.responses = update.responses
      this.session.tasks = update.tasks
      this.session.status = update.status
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
      // socket.on('terminal', (data: string) => {
      //   term.write(data)
      // })
      // term.onData((data: string) => {
      //   socket.emit('terminal', data)
      // })
      socket.on('graph', (event: FileGraphUpdateEvent) => {
        if (!this.session) return
        this.session.graph.handleEvent(event)
        if (event.pwd) {
          this.session.pwd = event.pwd
        }
      })
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
