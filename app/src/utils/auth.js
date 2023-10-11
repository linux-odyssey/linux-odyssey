import api from './api'

export async function isLoggedIn() {
  const res = await api.get('/auth/check-session')
  const { loggedIn } = res.data
  return loggedIn
}

export const login = async (username, password) => {
  try {
    await api.post('/auth/login', { username, password })
    return true
  } catch (err) {
    if (err.response?.status === 401) {
      return false
    }
    throw err
  }
}

export const register = (username, email, password) => {
  return api.post('/auth/register', {
    username,
    password,
    email,
  })
}

export const logout = () => {
  return api.post('/auth/logout')
}
