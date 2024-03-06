import { Command } from '../command.js'

export interface Matcher {
  match(command: Partial<Command>): boolean
}
