import { model, Schema, Types } from 'mongoose'

export interface IProgress {
  quest: string
  sessions: Types.ObjectId[]
  completed: boolean
  startedAt: Date
  finishedAt?: Date
}

const progressSchema = new Schema<IProgress>({
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

export interface IUserProfile {
  user: Types.ObjectId
  progress: Map<string, IProgress>
}

export const UserProfile = model<IUserProfile>(
  'UserProfile',
  new Schema<IUserProfile>(
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
