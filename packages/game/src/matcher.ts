import { Command } from './command'

export interface Matcher {
  match(command: Partial<Command>): boolean
}
