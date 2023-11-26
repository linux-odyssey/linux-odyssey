import { Schema } from 'mongoose'
import conditionSchema from './condition.js'
import responseSchema from './response.js'
import hintSchema from './hint.js'

const commandResponderSchema = new Schema({
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

export default commandResponderSchema
