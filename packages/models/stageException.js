import { Schema } from 'mongoose'
import exceptionSchema from './exception.js'

const stageExceptionSchema = new Schema({
  catchAll: {
    type: Boolean,
    required: true,
    default: false,
  },
})

stageExceptionSchema.add(exceptionSchema)

export default stageExceptionSchema
