import { FileGraph } from '@linux-odyssey/file-graph'
// eslint-disable-next-line import/no-relative-packages
import { IResponse } from '../../packages/models/src/response'

export interface Task {
  id: number
  name: string
  completed: boolean
}

export interface StageResponse {
  status: string
  hints: string[]
  tasks: Task[]
  responses: IResponse[]
}

export interface Session {
  _id: string
  status: string
  graph: FileGraph
  pwd: string
  hints: string[][]
  tasks: Task[]
  responses: IResponse[][]
}
