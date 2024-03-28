import { FileGraph } from '@linux-odyssey/file-graph'

export interface Task {
  id: number
  name: string
  completed: boolean
}

export interface Session {
  status: string
  graph: FileGraph
  pwd: string
  hints: string[]
  tasks: Task[]
}
