import { Command } from '../command.js'
import { PwdMatcher } from './pwdMatcher.js'
import { CommandMatcher } from './commandMatcher.js'
import { ErrorMatcher } from './errorMatcher.js'
import { Matcher } from './matcher.js'
import { OutputMatcher } from './outputMatcher.js'

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
