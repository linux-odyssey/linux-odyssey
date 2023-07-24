import { model, Schema } from 'mongoose'

const Command = model(
  'Command',
  new Schema(
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
    },
    { timestamps: true }
  )
)

export default Command
