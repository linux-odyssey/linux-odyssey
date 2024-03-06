/* eslint-disable max-classes-per-file */
import { Command } from './command'
import { Matcher } from './matcher'

export class PatternMatcher {
  protected matcher: RegExp | null
  constructor(pattern?: string, args?: string) {
    this.matcher = pattern ? new RegExp(pattern, args) : null
  }

  test(input: string): boolean {
    if (!this.matcher) {
      return true
    }
    return this.matcher.test(input)
  }
}

export class CommandMatcher extends PatternMatcher implements Matcher {
  match(command: Partial<Command>): boolean {
    return !!command.command && this.test(command.command)
  }
}

export class ErrorMatcher extends PatternMatcher implements Matcher {
  match(command: Partial<Command>): boolean {
    if (!this.matcher) {
      return command.error === ''
    }
    return !!command.error && this.test(command.error)
  }
}

export class Condition {
  private matchers: Matcher[] = []
}
