import { Command } from '../types.js'
import { Matcher } from './Matcher.js'

export class OutputMatcher implements Matcher {
  private matcher: RegExp
  constructor(pattern: string, args?: string) {
    this.matcher = new RegExp(pattern, args)
  }

  match(command: Command): boolean {
    return !!command.output && this.matcher.test(command.output.trim())
  }
}
