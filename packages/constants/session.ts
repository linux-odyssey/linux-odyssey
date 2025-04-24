export interface SessionSummaryResponse {
  _id: string
  user: string
  quest: string
  status: string
  createdAt: Date
  lastActivityAt: Date
}

export interface SessionDetailResponse extends SessionSummaryResponse {
  hints: string[][]
  tasks: string[][]
  responses: string[][]
  graph: any
}
