import { Command } from '../types.js'
import { Matcher } from './Matcher.js'

export class CommandMatcher implements Matcher {
  private matcher: RegExp
  constructor(command: string, flags?: string) {
    this.matcher = new RegExp(command, flags)
  }

  match(command: Command): boolean {
    return !!command.command && this.matcher.test(command.command)
  }
}
