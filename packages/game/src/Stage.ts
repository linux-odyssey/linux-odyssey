import { IStage, ICommand, IFileExistenceChecker } from './schema'
import { Condition } from './condition/Condition'

export class Stage {
  id: string
  name: string
  private condition: Condition
  private requirements: string[]

  constructor({ id, name, condition, requirements }: IStage) {
    this.id = id
    this.name = name || ''
    this.condition = new Condition(condition)
    this.requirements = requirements || []
  }

  async satisfies(
    command: ICommand,
    checker: IFileExistenceChecker
  ): Promise<boolean> {
    return this.condition.match(command) && this.condition.check(checker)
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
}
