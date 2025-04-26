import { ICommand } from '../schema'
import { Matcher } from './Matcher.js'

export class PwdMatcher implements Matcher {
  constructor(private pwd: string) {}

  match(command: ICommand): boolean {
    return command.pwd === this.pwd
  }
}
