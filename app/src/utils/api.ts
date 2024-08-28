import axios from 'axios'
import { IQuest } from '@linux-odyssey/models'
import { GetSessionsRequest } from '@linux-odyssey/constants'
import { Session } from '../types'
import { UserProfile } from '../store/userProfile'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
export default api

export async function getUserProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/users/me')
  return res.data
}

export async function getQuest(id: string): Promise<IQuest> {
  const res = await api.get<IQuest>(`/quests/${id}`)
  return res.data
}

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

export async function getQuests(): Promise<IQuest[]> {
  const res = await api.get<IQuest[]>('/quests')
  return res.data
}
