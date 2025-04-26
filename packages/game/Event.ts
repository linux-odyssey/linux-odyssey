import { Condition } from './condition/Condition'
import {
  ICommand,
  ICondition,
  IFileExistenceChecker,
  IRequirements,
  IResponse,
} from './schema'

export class Event {
  id: string
  private condition: Condition
  private requirements: string[]

  constructor(
    id: string,
    condition: ICondition,
    private response: IResponse,
    requirements?: IRequirements
  ) {
    this.id = id
    this.condition = new Condition(condition)
    this.requirements = requirements || []
  }

  async satisfies(
    command: ICommand,
    checker: IFileExistenceChecker
  ): Promise<boolean> {
    return this.condition.satisfies(command, checker)
  }

  private checkRequirements(completed: string[]): boolean {
    return this.requirements.every((req) => completed.includes(req))
  }

  private finished(completed: string[]): boolean {
    return completed.includes(this.id)
  }

  active(completed: string[]): boolean {
    return !this.finished(completed) && this.checkRequirements(completed)
  }

  getResponse(): IResponse {
    return this.response
  }
}
