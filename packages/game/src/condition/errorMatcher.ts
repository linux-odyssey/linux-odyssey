import { Matcher } from './matcher.js'
import { Command } from '../command.js'

export class ErrorMatcher implements Matcher {
  private matcher?: RegExp
  constructor(errorPattern?: string) {
    if (errorPattern) {
      this.matcher = new RegExp(errorPattern)
    }
  }

  match(command: Partial<Command>): boolean {
    if (!this.matcher) {
      return !command.error
    }
    return this.matcher.test(command.error || '')
  }
}
