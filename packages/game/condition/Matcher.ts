import { ICommand } from '../schema'

export interface Matcher {
  match(command: ICommand): boolean
}
