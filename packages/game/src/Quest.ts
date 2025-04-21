/* eslint-disable no-await-in-loop */
import { Condition } from './condition/Condition'
import { Event } from './Event'
import { GlobalException, StageException } from './Exception'
import {
  IQuest,
  IStage,
  IFileExistenceChecker,
  ICommand,
  IResponse,
} from './schema'
import { Stage } from './Stage'

export class Quest {
  private quest: IQuest
  private stages: Stage[]
  private exceptions: GlobalException[] = []
  private events: Map<string, Event> = new Map()

  constructor(
    quest: IQuest,
    private checker: IFileExistenceChecker
  ) {
    this.quest = quest
    this.stages = quest.stages.map((stage) => new Stage(stage))
    for (const stage of this.stages) {
      this.events.set(stage.id, stage)
      for (const exception of stage.getExceptions()) {
        this.events.set(exception.id, exception)
      }
    }
    for (const exception of quest.exceptions ?? []) {
      const globalException = new GlobalException(exception)
      this.exceptions.push(globalException)
      this.events.set(globalException.id, globalException)
    }
  }

  getActiveStages(completed: string[]) {
    return this.stages.filter((stage) => stage.active(completed))
  }

  private getActiveExceptions(completed: string[]) {
    return this.exceptions.filter((exception) => exception.active(completed))
  }

  async findSatisfiedEvent(
    command: ICommand,
    completed: string[]
  ): Promise<string | null> {
    const stages = this.getActiveStages(completed)
    let catchAllException: string | null = null
    for (const stage of stages) {
      const satisfies = await stage.satisfies(command, this.checker)
      if (satisfies) {
        return stage.id
      }
    }
    for (const exception of stages.flatMap((stage) => stage.getExceptions())) {
      if (exception.catchAll && !catchAllException) {
        catchAllException = exception.id
      } else if (await exception.satisfies(command, this.checker)) {
        return exception.id
      }
    }
    for (const exception of this.getActiveExceptions(completed)) {
      if (await exception.satisfies(command, this.checker)) {
        return exception.id
      }
    }
    return catchAllException
  }

  getResponses(completed: string[]): IResponse[] {
    return this.quest.stages
      .filter((stage) => completed.includes(stage.id))
      .map((stage) => stage.response)
  }
}
