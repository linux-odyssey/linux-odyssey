import { model, Schema } from 'mongoose'
import { FileNode } from '@linux-odyssey/file-graph'

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
      progress: String,
      completion: [String],
      hints: [String],
      graph: {
        type: nodeSchema,
        default: new FileNode({
          path: '/',
          type: 'folder',
        }),
      },
    },
    { timestamps: true }
  )
)

export default Session
