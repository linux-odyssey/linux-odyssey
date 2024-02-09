import axios from 'axios'

function getCsrf() {
  // Decode the csrf token from cookie
  const name = '_csrf'
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(';').shift())
  return null
}

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const csrf = getCsrf()
    if (csrf) {
      config.headers['x-csrf-token'] = csrf
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
