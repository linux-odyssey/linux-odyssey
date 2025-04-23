import { FileGraph } from '@linux-odyssey/file-graph'
import { IResponse, ITask } from '@linux-odyssey/game'

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
  // graph: FileGraph
  // pwd: string
  // hints: string[][]
  tasks: ITask[]
  responses: IResponse[]
}
