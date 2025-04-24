import { ICommand } from '../schema'
import { Matcher } from './Matcher.js'

export class OrMatcher implements Matcher {
  constructor(private conditions: Matcher[]) {}

  match(command: ICommand): boolean {
    return this.conditions.some((condition) => condition.match(command))
  }
}
