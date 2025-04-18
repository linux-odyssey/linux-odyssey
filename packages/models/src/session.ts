import { model, Schema, Types } from 'mongoose'

export interface INode {
  path: string
  type: string
  discovered: boolean
  children?: INode[]
}

const nodeSchema = new Schema<INode>({
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

export interface ISession {
  _id: Types.ObjectId
  user: Types.ObjectId
  quest: string
  containerId: string | null
  status: 'active' | 'finished' | 'inactive'
  createdAt: Date
  updatedAt: Date
  finishedAt?: Date
  lastActivityAt: Date
  stages: string[]
  graph: INode
}

export const Session = model<ISession>(
  'Session',
  new Schema<ISession>(
    {
      user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      quest: {
        type: String,
        ref: 'Quest',
        required: true,
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
      stages: [String],
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
