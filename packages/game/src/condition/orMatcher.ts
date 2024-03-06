import { Command } from '../command.js'
import { Matcher } from './matcher.js'

export class OrMatcher implements Matcher {
  constructor(private conditions: Matcher[]) {}

  match(command: Partial<Command>): boolean {
    return this.conditions.some((condition) => condition.match(command))
  }
}
