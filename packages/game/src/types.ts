export interface Command {
  command?: string
  output?: string
  error?: string
  pwd?: string
}

export interface ICondition {
  command?: string
  output?: string
  error?: string
  pwd?: string
  or?: ICondition[]
  not?: ICondition
}

export enum FileType {
  FILE = 'file',
  FOLDER = 'folder',
}

export interface FileInput {
  path: string
  type: FileType
}

export interface IFileExistenceChecker {
  exists(file: FileInput): Promise<boolean>
}
