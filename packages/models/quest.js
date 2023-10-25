import { model, Schema } from 'mongoose'

const responseSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  content: [String],
  speaker: String,
  color: String,
})

const fileConditionSchema = new Schema({
  path: String,
  type: String,
  exists: Boolean,
})

const conditionSchema = new Schema({
  command: [String],
  output: [String],
  error: [String],
  pwd: [String],
  files: [fileConditionSchema],
})

conditionSchema.add({
  $or: [conditionSchema],
  $not: conditionSchema,
})

const stageSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  task: {
    type: String,
  },
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
  repeatable: {
    type: Boolean,
    required: true,
    default: false,
  },
  condition: conditionSchema,
  responses: {
    type: [responseSchema],
    required: true,
  },
  hints: {
    type: [String],
    required: true,
  },
})

const Quest = model(
  'Quest',
  new Schema({
    _id: String,
    title: String,
    order: Number,
    instruction: String,
    stages: [stageSchema],
  })
)

export default Quest
