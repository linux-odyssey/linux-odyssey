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
    command: [String],
    output: [String],
    error: [String],
    pwd: [String],
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
    _id: String,
    title: String,
    order: Number,
    instruction: String,
    tasks: {
      id: String,
      content: String,
      display: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    stages: [stageSchema],
  })
)

export default Quest
