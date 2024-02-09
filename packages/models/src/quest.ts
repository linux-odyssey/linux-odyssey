import { model, Schema } from 'mongoose'
import { IStage, stageSchema } from './stage.js'
import { globalExceptionSchema, IGlobalException } from './globalException.js'
import { IRequirement } from './requirement.js'

export interface IQuest extends IRequirement {
  _id: string
  title: string
  image: string
  instruction: string
  stages: IStage[]
  exceptions: IGlobalException[]
}

export const Quest = model<IQuest>(
  'Quest',
  new Schema<IQuest>({
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
