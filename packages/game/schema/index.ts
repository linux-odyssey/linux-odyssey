import { IFileNode } from '../../file-graph'

export * from './condition.js'
export * from './stage.js'
export * from './requirements.js'
export * from './response.js'
export * from './quest.js'
export * from './exception.js'
export * from './command.js'

export interface ISession {
  completedEvents: string[]
  graph: IFileNode
}

export interface ITask {
  id: string
  name: string
  completed: boolean
}
