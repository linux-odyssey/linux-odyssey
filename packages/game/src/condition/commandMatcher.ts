import { Command } from '../command.js'
import { Matcher } from './matcher.js'

export class CommandMatcher implements Matcher {
  private matcher: RegExp
  constructor(command: string, flags?: string) {
    this.matcher = new RegExp(command, flags)
  }

  match(command: Partial<Command>): boolean {
    return !!command.command && this.matcher.test(command.command)
  }
}
