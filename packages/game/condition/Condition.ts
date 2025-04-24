import {
  ICommand,
  IFileExistenceChecker,
  ICondition,
  IFileExistenceInput,
} from '../schema'
import { PwdMatcher } from './PwdMatcher.js'
import { CommandMatcher } from './CommandMatcher.js'
import { ErrorMatcher } from './ErrorMatcher.js'
import { Matcher } from './Matcher.js'
import { OutputMatcher } from './OutputMatcher.js'
import { OrMatcher } from './OrMatcher.js'
import { NotMatcher } from './NotMatcher.js'
import { checkFiles } from './FileMatcher.js'

export class Condition {
  private files: IFileExistenceInput[] = []
  private matchers: Matcher[] = []

  constructor({ command, output, error, pwd, or, not, files }: ICondition) {
    if (command) this.matchers.push(new CommandMatcher(command))
    if (output) this.matchers.push(new OutputMatcher(output))
    if (pwd) this.matchers.push(new PwdMatcher(pwd))
    if (or) {
      const conditions = or.map((condition) => new Condition(condition))
      this.matchers.push(new OrMatcher(conditions))
    }
    if (not) this.matchers.push(new NotMatcher(new Condition(not)))
    if (files) this.files = files
    this.matchers.push(new ErrorMatcher(error)) // always check unexpected error
  }

  match(command: ICommand): boolean {
    return this.matchers.every((matcher) => {
      return matcher.match(command)
    })
  }

  async check(checker: IFileExistenceChecker): Promise<boolean> {
    if (this.matchers.length === 0) return true
    return checkFiles(checker, this.files)
  }

  async satisfies(
    command: ICommand,
    checker: IFileExistenceChecker
  ): Promise<boolean> {
    // Error matcher is always true
    if (this.matchers.length === 1 && this.files.length === 0) return false
    // eslint-disable-next-line no-return-await
    return this.match(command) && (await this.check(checker))
  }
}
