export { conditionSchema, ICondition } from './condition.js'
export { stageSchema, IStage } from './stage.js'
export { requirementsSchema, IRequirements } from './requirements.js'
export { responseSchema, IResponse } from './response.js'
export { questSchema, IQuest } from './quest.js'

export interface ICommand {
  command?: string
  output?: string
  error?: string
  pwd?: string
}

export enum FileType {
  FILE = 'file',
  FOLDER = 'folder',
}

export interface FileInput {
  path: string
  type: FileType
}

export interface FileExistenceInput extends FileInput {
  exists: boolean
}

export interface IFileExistenceChecker {
  exists(file: FileInput): Promise<boolean>
}

export interface ISession {
  completedStages: string[]
}
