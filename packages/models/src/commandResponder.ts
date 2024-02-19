import { Schema } from 'mongoose'
import { conditionSchema, ICondition } from './condition.js'
import { responseSchema, IResponse } from './response.js'
import { hintSchema, IHint } from './hint.js'

export interface ICommandResponder extends IHint {
  condition?: ICondition
  responses: IResponse[]
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
