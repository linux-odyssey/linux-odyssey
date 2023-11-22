import { reactive } from 'vue'
import api from '../utils/api'

const store = reactive({
  username: '',
  email: '',
  progress: {},
})

export async function loadUserProfile() {
  try {
    const res = await api.get('/users/me')
    const { username, email, progress } = res.data
    store.username = username
    store.email = email
    store.progress = progress
    return store
  } catch (err) {
    console.error(err)
    throw new Error(`Failed to load user profile: ${err.message}`)
  }
}

export function resetUserProfile() {
  store.username = ''
  store.email = ''
  store.progress = {}
}

export default store
