import { HydratedDocument } from 'mongoose'
import type {
  Quest,
  Response,
  Requirement,
  Stage,
  Task,
  Exception,
} from '@linux-odyssey/constants'
import { ISession } from '@linux-odyssey/models'

export interface ExecuteResult {
  responses: Response[]
  status: string
  stage?: string
  end?: boolean
}

export default class SessionHandler {
  session: HydratedDocument<ISession>
  quest: Quest

  constructor(session: HydratedDocument<ISession>, quest: Quest) {
    this.session = session
    this.quest = quest
  }

  getSession(): HydratedDocument<ISession> {
    return this.session
  }

  getTask(stage: Partial<Stage>): Task | undefined {
    return this.session.tasks.find((t) => t.id === stage.id)
  }

  isCompleted(stage: Partial<IStage>): boolean {
    const task = this.getTask(stage)
    return task ? task.completed : false
  }

  getUnlockedComponents<T extends { requirements: Requirement }>(
    components: T[]
  ): T[] {
    return components.filter((component) =>
      component.requirements.every((r: string) => this.isCompleted({ id: r }))
    )
  }

  getStages() {
    const unlockedStages = this.getUnlockedComponents(this.quest.stages)
    return unlockedStages.filter((s) => !this.isCompleted(s))
  }

  getNewTasks() {
    const stages = this.getStages()
    return stages
      .filter((s) => s.task)
      .filter((s) => !this.session.tasks.some((t) => t.id === s.id))
      .map((s) => ({ id: s.id, name: s.task, completed: false }))
  }

  addNewTasks() {
    const newTasks = this.getNewTasks()
    this.session.tasks.push(...newTasks)
  }

  execute(stage: Stage): ExecuteResult {
    this.session.tasks
      .filter((t) => t.id === stage.id)
      .forEach((t) => {
        t.completed = true
      })

    this.addNewTasks()

    if (stage.id === 'END') {
      this.session.status = 'finished'
    }

    return {
      responses: stage.responses,
      status: this.session.status,
    }
  }

  executeException(exception: Exception): ExecuteResult {
    const { responses } = exception

    return {
      responses,
      status: this.session.status,
    }
  }
}
