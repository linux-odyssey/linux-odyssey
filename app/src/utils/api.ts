import axios from 'axios'
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
