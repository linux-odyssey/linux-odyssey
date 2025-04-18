import { Quest } from './Quest'
import { IQuest } from './schema'
import { ICommand, ISession, IFileExistenceChecker } from './types'

export class Session implements ISession {
  private completed: string[] = []
  private quest: Quest

  constructor(
    { completedStages }: ISession,
    quest: IQuest,
    checker: IFileExistenceChecker
  ) {
    this.completed = completedStages
    this.quest = new Quest(quest, checker)
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

  async runCommand(command: ICommand) {
    const stageId = await this.quest.findSatisfiedStage(command, this.completed)
    if (stageId) {
      this.complete(stageId)
    }
    return stageId
  }
}
