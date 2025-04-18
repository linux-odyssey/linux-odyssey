/* eslint-disable no-await-in-loop */
import {
  IQuest,
  IStage,
  IFileExistenceChecker,
  ICommand,
  IResponse,
} from './schema'
import { Stage } from './Stage'

export class Quest {
  private stages: Stage[]
  private quest: IQuest

  constructor(
    quest: IQuest,
    private checker: IFileExistenceChecker
  ) {
    this.quest = quest
    this.stages = quest.stages.map((stage: IStage) => new Stage(stage))
  }

  getActiveStages(completed: string[]) {
    return this.stages.filter((stage) => stage.active(completed))
  }

  async findSatisfiedStage(
    command: ICommand,
    completed: string[]
  ): Promise<string | null> {
    const stages = this.getActiveStages(completed)
    for (const stage of stages) {
      const satisfies = await stage.satisfies(command, this.checker)
      if (satisfies) {
        return stage.id
      }
    }
    return null
  }

  getResponses(completed: string[]): IResponse[] {
    return this.quest.stages
      .filter((stage) => completed.includes(stage.id))
      .map((stage) => stage.response)
  }
}
