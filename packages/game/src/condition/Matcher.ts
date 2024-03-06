import { Command } from '../types.js'

export interface Matcher {
  match(command: Command): boolean
}
