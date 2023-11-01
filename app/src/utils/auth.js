import api from './api'

import {
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from './errors'

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
      throw new UnauthorizedError(err.response.data.message)
    }
    if (err.response?.status === 429) {
      throw new TooManyRequestsError(err.response.data.message)
    }
    if (err.response?.status === 400) {
      throw new ValidationError(err.response.data.message)
    }
    throw err
  }
}

export const register = async (username, email, password) => {
  try {
    await api.post('/auth/register', {
      username,
      password,
      email,
    })
    return true
  } catch (err) {
    const status = err.response?.status
    if (status === 429) {
      throw new TooManyRequestsError(err.response.data.message)
    }
    if (status === 401) {
      throw new UnauthorizedError(err.response.data.message)
    }
    if (status === 400) {
      const { errors } = err.response.data
      if (errors?.length > 0) {
        const { path, msg } = errors[0]
        switch (path) {
          case 'username':
            throw new ValidationError('Username is already taken')
          case 'email':
            throw new ValidationError('Email is already taken')
          case 'password':
            throw new ValidationError('Password is too weak')
          default:
            throw new ValidationError(msg)
        }
      }
    }
    throw err
  }
}

export const logout = () => {
  return api.post('/auth/logout')
}
