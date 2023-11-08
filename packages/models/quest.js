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
  condition: {
    type: conditionSchema,
    required: true,
  },
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
    _id: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    requirements: {
      type: [
        {
          type: String,
          ref: 'Quest',
        },
      ],
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    stages: {
      type: [stageSchema],
      required: true,
    },
  })
)

export default Quest
