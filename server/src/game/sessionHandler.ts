import { HydratedDocument } from 'mongoose'
import type {
  IException,
  IQuest,
  IRequirement,
  IResponse,
  ISession,
  IStage,
  ITask,
} from '@linux-odyssey/models'

export interface ExecuteResult {
  responses: IResponse[]
  hints: string[]
  tasks?: ITask[]
  status: string
  stage?: string
  end?: boolean
}

export default class SessionHandler {
  session: HydratedDocument<ISession>
  quest: HydratedDocument<IQuest>

  constructor(
    session: HydratedDocument<ISession>,
    quest: HydratedDocument<IQuest>
  ) {
    this.session = session
    this.quest = quest
  }

  getSession(): HydratedDocument<ISession> {
    return this.session
  }

  getTask(stage: Partial<IStage>): ITask | undefined {
    return this.session.tasks.find((t) => t.id === stage.id)
  }

  isCompleted(stage: Partial<IStage>): boolean {
    const task = this.getTask(stage)
    return task ? task.completed : false
  }

  getUnlockedComponents<T extends IRequirement>(components: T[]): T[] {
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

  execute(stage: IStage): ExecuteResult {
    this.session.tasks
      .filter((t) => t.id === stage.id)
      .forEach((t) => {
        t.completed = true
      })

    if (stage.hints && stage.hints.length > 0)
      this.session.hints.push(stage.hints)

    this.addNewTasks()

    return {
      responses: stage.responses,
      hints: stage.hints,
      tasks: this.session.tasks,
      status: this.session.status,
    }
  }

  executeException(exception: IException): ExecuteResult {
    const { hints, responses } = exception
    if (hints && hints.length > 0) this.session.hints.push(hints)

    return {
      responses,
      hints,
      status: this.session.status,
    }
  }
}
