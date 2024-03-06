/* eslint-disable max-classes-per-file */
import { Command } from './command'
import { Matcher } from './matcher'

export class CommandMatcher implements Matcher {
  private matcher: RegExp
  constructor(pattern: string, args?: string) {
    this.matcher = new RegExp(pattern, args)
  }

  match(command: Partial<Command>): boolean {
    return !!command.command && this.matcher.test(command.command)
  }
}

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

export class PwdMatcher implements Matcher {
  constructor(private pwd: string) {}

  match(command: Partial<Command>): boolean {
    return command.pwd === this.pwd
  }
}

export class OutputMatcher implements Matcher {
  private matcher: RegExp
  constructor(pattern: string, args?: string) {
    this.matcher = new RegExp(pattern, args)
  }

  match(command: Partial<Command>): boolean {
    return !!command.output && this.matcher.test(command.output.trim())
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
    if (output) this.matchers.push(new OutputMatcher(output))
    if (pwd) this.matchers.push(new PwdMatcher(pwd))
    this.matchers.push(new ErrorMatcher(error)) // always check unexpected error
  }

  match(command: Partial<Command>): boolean {
    return this.matchers.every((matcher) => {
      return matcher.match(command)
    })
  }
}
