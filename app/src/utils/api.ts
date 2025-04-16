import axios from 'axios'
import { GetSessionsRequest } from '@linux-odyssey/constants'
import { Session } from '../types'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
export default api

export async function createSession(questId: string): Promise<Session> {
  const res = await api.post<Session>('/sessions', { questId })
  return res.data
}

export async function getSessions(
  request: GetSessionsRequest
): Promise<Session[]> {
  const res = await api.get<Session[]>('/sessions', { params: request })
  return res.data
}

export async function getActiveSession(
  questId: string
): Promise<Session | null> {
  const res = await api.get<Session | null>('/sessions/active', {
    params: { questId },
  })
  return res.data
}
