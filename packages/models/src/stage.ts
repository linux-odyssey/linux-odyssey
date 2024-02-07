import { Schema } from 'mongoose'
import commandResponderSchema from './commandResponder.js'
import stageExceptionSchema from './stageException.js'
import requirementSchema from './requirement.js'

const stageSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  exceptions: {
    type: [stageExceptionSchema],
    required: true,
  },
})

stageSchema.add(commandResponderSchema)
stageSchema.add(requirementSchema)

export default stageSchema
