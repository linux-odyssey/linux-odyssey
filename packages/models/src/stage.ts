import { Schema } from 'mongoose'
import {
  commandResponderSchema,
  ICommandResponder,
} from './commandResponder.js'
import { stageExceptionSchema, IStageException } from './stageException.js'
import { requirementSchema, IRequirement } from './requirement.js'

export interface IStage extends IRequirement, ICommandResponder {
  id: string
  task: string
  exceptions: IStageException[]
}

export const stageSchema = new Schema<IStage>({
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
