import { Schema } from 'mongoose'

const fileConditionSchema = new Schema({
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

const conditionSchema = new Schema({
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

export default conditionSchema
