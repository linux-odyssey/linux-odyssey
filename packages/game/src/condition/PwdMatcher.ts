import { Command } from '../types.js'
import { Matcher } from './Matcher.js'

export class PwdMatcher implements Matcher {
  constructor(private pwd: string) {}

  match(command: Command): boolean {
    return command.pwd === this.pwd
  }
}
