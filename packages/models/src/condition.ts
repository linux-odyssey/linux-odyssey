import { Schema } from 'mongoose'

export interface IFileCondition {
  path: string
  type?: string
  exists?: boolean
}

export interface ICondition {
  command?: string[]
  output?: string[]
  error?: string[]
  pwd?: string[]
  files?: IFileCondition[]
  or?: ICondition[]
  not?: ICondition
}

export const fileConditionSchema = new Schema<IFileCondition>({
  path: {
    type: String,
    required: true,
  },
  type: String,
  exists: {
    type: Boolean,
    default: true,
  },
})

export const conditionSchema = new Schema<ICondition>({
  command: [String],
  output: [String],
  error: [String],
  pwd: [String],
  files: [fileConditionSchema],
})

conditionSchema.add({
  or: [conditionSchema],
  not: conditionSchema,
})
