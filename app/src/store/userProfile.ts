import { defineStore } from 'pinia'
import { getUserProfile } from '../utils/api'

interface IProgress {
  quest: string
  sessions: string[]
  completed: boolean
  startedAt: Date
  finishedAt?: Date
}

export interface UserProfile {
  username: string
  email: string
  progress: Record<string, IProgress>
}

const useUserProfile = defineStore('userProfile', {
  state: (): UserProfile => ({
    username: '',
    email: '',
    progress: {},
  }),
  actions: {
    async loadUserProfile() {
      const res = await getUserProfile()
      this.$patch(res)
    },
    async resetUserProfile() {
      this.$reset()
    },
  },
})

export default useUserProfile
