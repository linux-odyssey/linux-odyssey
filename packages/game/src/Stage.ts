import { IStage, ICommand } from './types'
import { Condition } from './condition/Condition'

export class Stage {
  id: string
  name: string
  condition: Condition

  constructor({ id, name, condition }: IStage) {
    this.id = id
    this.name = name
    this.condition = new Condition(condition)
  }

  satisfies(command: ICommand): boolean {
    return this.condition.match(command)
  }
}
