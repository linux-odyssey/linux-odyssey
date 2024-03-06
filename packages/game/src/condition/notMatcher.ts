import { Command } from '../command.js'
import { Matcher } from './matcher.js'

export class NotMatcher implements Matcher {
  constructor(private condition: Matcher) {}

  match(command: Partial<Command>): boolean {
    return !this.condition.match(command)
  }
}
