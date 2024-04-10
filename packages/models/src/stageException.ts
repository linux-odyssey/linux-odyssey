import { Schema } from 'mongoose'
import { exceptionSchema, IException } from './exception.js'

export interface IStageException extends IException {
  catchAll: boolean
}

export const stageExceptionSchema = new Schema<IStageException>({
  catchAll: {
    type: Boolean,
    required: true,
    default: false,
  },
})

stageExceptionSchema.add(exceptionSchema)
