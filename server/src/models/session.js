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
      status: {
        type: String,
        enum: ['active', 'finished', 'deactive'],
        required: true,
        default: 'active',
      },
      finishedAt: Date,
      lastActivityAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      progress: String,
      completion: [String],
      hints: [String],
    },
    { timestamps: true }
  )
)

export default Session
