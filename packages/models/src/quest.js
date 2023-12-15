import { model, Schema } from 'mongoose'
import stageSchema from './stage.js'
import globalExceptionSchema from './globalException.js'

const Quest = model(
  'Quest',
  new Schema({
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
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
    exceptions: {
      type: [globalExceptionSchema],
      required: true,
    },
  })
)

export default Quest
