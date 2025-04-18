import { Quest } from './Quest'
import { IQuest } from './schema'
import { ISession } from './types'

export class Session implements ISession {
  private completed: string[] = []
  private quest: Quest

  constructor({ completedStages }: ISession, quest: IQuest) {
    this.completed = completedStages
    this.quest = new Quest(quest)
  }

  get completedStages() {
    return this.completed
  }

  complete(stageId: string) {
    this.completed.push(stageId)
  }

  getActiveStages(): string[] {
    return this.quest.getActiveStages(this.completed).map((stage) => stage.id)
  }
}
