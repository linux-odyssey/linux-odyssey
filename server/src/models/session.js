import { model, Schema } from 'mongoose'

export default model(
  'Session',
  {
    name: String,
    containerId: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    quest: {
      type: Schema.ObjectId,
      ref: 'Quest',
    },
    finishedAt: Date,
    terminals: [String],
  },
  { timestamps: true }
)
