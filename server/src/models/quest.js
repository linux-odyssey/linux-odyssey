import { model, Schema } from 'mongoose'

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
    type: [String],
    required: true,
  },
  hint: {
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
    introduction: String,
    stages: [stageSchema],
  })
)

export default Quest
