import { model, Schema } from 'mongoose'

const progressSchema = new Schema({
  quest: {
    type: String,
    ref: 'Quest',
    required: true,
  },
  sessions: [
    {
      type: Schema.ObjectId,
      ref: 'Session',
      required: true,
    },
  ],
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  finishedAt: Date,
})

const UserProfile = model(
  'UserProfile',
  new Schema(
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
      },
      progress: {
        type: Map,
        of: progressSchema,
        default: {},
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
)

export default UserProfile
