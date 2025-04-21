export * from './condition.js'
export * from './stage.js'
export * from './requirements.js'
export * from './response.js'
export * from './quest.js'
export * from './exception.js'

export interface ICommand {
  command?: string
  output?: string
  error?: string
  pwd?: string
}

export interface ISession {
  completedEvents: string[]
}

export interface ITask {
  id: string
  name: string
  completed: boolean
}
