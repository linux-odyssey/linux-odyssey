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
        type: String,
        ref: 'Quest',
      },
      containerId: String,
      finishedAt: Date,
    },
    { timestamps: true }
  )
)

export default Session
