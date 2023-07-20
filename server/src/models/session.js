import { model, Schema } from 'mongoose'

const Session = model(
  'Session',
  new Schema(
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
      },
      quest: {
        type: Schema.ObjectId,
        ref: 'Quest',
      },
      containerId: String,
      finishedAt: Date,
      terminals: [String],
    },
    { timestamps: true }
  )
)

export default Session
