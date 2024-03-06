import { Command } from '../types.js'
import { Matcher } from './Matcher.js'

export class OrMatcher implements Matcher {
  constructor(private conditions: Matcher[]) {}

  match(command: Command): boolean {
    return this.conditions.some((condition) => condition.match(command))
  }
}
