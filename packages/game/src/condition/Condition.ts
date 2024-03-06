/* eslint-disable max-classes-per-file */
import { Command, ICondition } from '../types.js'
import { PwdMatcher } from './PwdMatcher.js'
import { CommandMatcher } from './CommandMatcher.js'
import { ErrorMatcher } from './ErrorMatcher.js'
import { Matcher } from './Matcher.js'
import { OutputMatcher } from './OutputMatcher.js'
import { OrMatcher } from './OrMatcher.js'
import { NotMatcher } from './NotMatcher.js'

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

  match(command: Command): boolean {
    return this.matchers.every((matcher) => {
      return matcher.match(command)
    })
  }
}
