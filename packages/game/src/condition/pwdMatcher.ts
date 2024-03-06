import { Command } from '../command.js'
import { Matcher } from './matcher.js'

export class PwdMatcher implements Matcher {
  constructor(private pwd: string) {}

  match(command: Partial<Command>): boolean {
    return command.pwd === this.pwd
  }
}
