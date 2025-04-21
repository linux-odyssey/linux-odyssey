import { Quest } from './Quest'
import {
  IQuest,
  ICommand,
  ISession,
  IFileExistenceChecker,
  IResponse,
} from './schema'

export class Session implements ISession {
  private completed: string[] = []
  private quest: Quest

  constructor(
    { completedEvents }: ISession,
    quest: IQuest,
    checker: IFileExistenceChecker
  ) {
    this.completed = completedEvents
    this.quest = new Quest(quest, checker)
  }

  get completedEvents() {
    return this.completed
  }

  complete(stageId: string) {
    this.completed.push(stageId)
  }

  getActiveStages(): string[] {
    return this.quest.getActiveStages(this.completed).map((stage) => stage.id)
  }

  async runCommand(command: ICommand) {
    const stageId = await this.quest.findSatisfiedEvent(command, this.completed)
    if (stageId) {
      this.complete(stageId)
    }
    return stageId
  }

  getResponses(): IResponse[] {
    return this.quest.getResponses(this.completed)
  }
}
