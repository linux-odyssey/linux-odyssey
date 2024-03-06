/* eslint-disable max-classes-per-file */
import { Command } from '../command.js'
import { PwdMatcher } from './pwdMatcher.js'
import { CommandMatcher } from './commandMatcher.js'
import { ErrorMatcher } from './errorMatcher.js'
import { Matcher } from './matcher.js'
import { OutputMatcher } from './outputMatcher.js'
import { OrMatcher } from './orMatcher.js'
import { NotMatcher } from './notMatcher.js'

export interface ICondition {
  command?: string
  output?: string
  error?: string
  pwd?: string
  or?: ICondition[]
  not?: ICondition
}

export class Condition {
  private matchers: Matcher[] = []

  constructor({ command, output, error, pwd, or, not }: ICondition) {
    if (command) this.matchers.push(new CommandMatcher(command))
    if (output) this.matchers.push(new OutputMatcher(output))
    if (pwd) this.matchers.push(new PwdMatcher(pwd))
    if (or) {
      const conditions = or.map((condition) => new Condition(condition))
      this.matchers.push(new OrMatcher(conditions))
    }
    if (not) this.matchers.push(new NotMatcher(new Condition(not)))
    this.matchers.push(new ErrorMatcher(error)) // always check unexpected error
  }

  match(command: Partial<Command>): boolean {
    return this.matchers.every((matcher) => {
      return matcher.match(command)
    })
  }
}
