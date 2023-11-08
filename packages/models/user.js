import { model, Schema } from 'mongoose'

const progressSchema = new Schema({
  quest: {
    type: String,
    ref: 'Quest',
  },
  sessions: [
    {
      type: Schema.ObjectId,
      ref: 'Session',
    },
  ],
  completionStatus: {
    type: String,
    enum: ['incomplete', 'completed'],
  },
  startedAt: Date,
  finishedAt: Date,
})

const User = model(
  'User',
  new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      hashedPassword: String,
      google: {
        id: String,
        displayName: String,
      },
      github: {
        id: String,
        displayName: String,
      },
      progress: [progressSchema],
    },
    {
      timestamps: true,
    }
  )
)

export default User
