import { model, Schema, Types } from 'mongoose'

export interface ICommand {
  session: Types.ObjectId
  pwd: string
  command: string
  output?: string
  error?: string
  stage?: string
  createdAt: Date
  updatedAt: Date
}

export const Command = model<ICommand>(
  'Command',
  new Schema<ICommand>(
    {
      session: {
        type: Schema.ObjectId,
        ref: 'Session',
        required: true,
      },
      pwd: {
        type: String,
        required: true,
      },
      command: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: false,
      },
      error: {
        type: String,
        required: false,
      },
      stage: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  )
)
