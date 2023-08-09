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
  condition: {
    command: {
      type: [String],
      required: false,
    },
    output: {
      type: [String],
      required: false,
    },
    error: {
      type: [String],
      required: false,
    },
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
  hints: {
    type: [String],
    required: true,
  },
  next: {
    type: String,
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
