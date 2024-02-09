import { Schema } from 'mongoose'
import { conditionSchema, ICondition } from './condition.js'
import { responseSchema, IResponse } from './response.js'
import { hintSchema, IHint } from './hint.js'

export interface ICommandResponder {
  condition?: ICondition
  responses: IResponse[]
  hints?: IHint[]
}

export const commandResponderSchema = new Schema<ICommandResponder>({
  condition: {
    type: conditionSchema,
    required: false,
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
})

commandResponderSchema.add(hintSchema)
