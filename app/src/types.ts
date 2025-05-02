import type { FileGraph } from '../../packages/file-graph'
import type { IResponse, ITask } from '../../packages/game'

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
  tasks: ITask[]
  responses: IResponse[]
  token: string
  containerName: string
}
