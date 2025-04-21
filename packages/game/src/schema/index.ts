export * from './condition.js'
export { stageSchema, IStage } from './stage.js'
export { requirementsSchema, IRequirements } from './requirements.js'
export { responseSchema, IResponse } from './response.js'
export { questSchema, IQuest } from './quest.js'
export { exceptionSchema, IException } from './exception.js'

export interface ICommand {
  command?: string
  output?: string
  error?: string
  pwd?: string
}

export interface ISession {
  completedEvents: string[]
}
