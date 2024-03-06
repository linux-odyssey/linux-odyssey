/* eslint-disable max-classes-per-file */
import { Command } from './command'
import { Matcher } from './matcher'

export class PatternMatcher {
  protected matcher: RegExp
  constructor(pattern: string, args?: string) {
    this.matcher = new RegExp(pattern, args)
  }

  test(input: string): boolean {
    return this.matcher.test(input)
  }
}

export class CommandMatcher extends PatternMatcher implements Matcher {
  match(command: Partial<Command>): boolean {
    return !!command.command && this.test(command.command)
  }
}

export class ErrorMatcher extends PatternMatcher implements Matcher {
  constructor(private errorPattern?: string) {
    super(errorPattern || '')
  }

  match(command: Partial<Command>): boolean {
    if (!this.errorPattern) {
      return command.error === ''
    }
    return !!command.error && this.test(command.error)
  }
}

export class PwdMatcher implements Matcher {
  constructor(private pwd: string) {}

  match(command: Partial<Command>): boolean {
    return command.pwd === this.pwd
  }
}

export interface ICondition {
  command?: string
  output?: string
  error?: string
  pwd?: string
}

export class Condition {
  private matchers: Matcher[] = []

  constructor({ command, output, error, pwd }: ICondition) {
    if (command) this.matchers.push(new CommandMatcher(command))
    // if (output) this.matchers.push(new OutputMatcher(output))
    if (pwd) this.matchers.push(new PwdMatcher(pwd))
    this.matchers.push(new ErrorMatcher(error)) // always check unexpected error
  }
}
