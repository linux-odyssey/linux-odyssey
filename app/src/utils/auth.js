import api from './api'

export const login = async (username, password) => {
  try {
    const res = await api.post('/auth/login', { username, password })
    console.log(res.data)
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
