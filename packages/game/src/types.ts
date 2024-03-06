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
