import { model, Schema } from 'mongoose'

const nodeSchema = new Schema({
  path: String,
  type: String,
  discovered: {
    type: Boolean,
    default: false,
  },
})

nodeSchema.add({
  children: [nodeSchema],
})

const taskSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

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
        enum: ['active', 'finished', 'inactive'],
        required: true,
        default: 'active',
      },
      finishedAt: Date,
      lastActivityAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      tasks: [taskSchema],
      hints: [[String]],
      graph: {
        type: nodeSchema,
        default: {
          path: '/',
          type: 'folder',
        },
      },
    },
    { timestamps: true }
  )
)

export default Session
