import { Command } from '../command.js'
import { Matcher } from './matcher.js'

export class OutputMatcher implements Matcher {
  private matcher: RegExp
  constructor(pattern: string, args?: string) {
    this.matcher = new RegExp(pattern, args)
  }

  match(command: Partial<Command>): boolean {
    return !!command.output && this.matcher.test(command.output.trim())
  }
}
