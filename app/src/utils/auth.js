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
    if (!err.response) throw err
    const { status } = err.response
    switch (status) {
      case 401:
        throw new UnauthorizedError(err.response.data.message)

      case 429:
        throw new TooManyRequestsError(err.response.data.message)

      case 400:
        throw new ValidationError(err.response.data.message)

      default:
        throw err
    }
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
    if (!err.response) throw err
    const { status } = err.response
    if (status === 429) {
      throw new TooManyRequestsError(err.response.data.message)
    }
    if (status === 401) {
      throw new UnauthorizedError(err.response.data.message)
    }
    if (status === 400) {
      const { errors } = err.response.data
      if (Array.isArray(errors) && errors.length > 0) {
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
      throw new ValidationError(err.response.data.message)
    }
    throw err
  }
}

export const checkUsername = async (username) => {
  try {
    await api.get('/auth/check-username', {
      params: { username },
    })
    return true
  } catch (err) {
    if (!err.response) throw err
    const { status } = err.response
    if (status === 429) {
      throw new TooManyRequestsError('Too many requests')
    }
    if (status === 409) {
      throw new ValidationError('Username is already taken')
    }
    throw err
  }
}

export const chooseUsername = async (username) => {
  try {
    await api.post('/auth/register-from-session', { username })
  } catch (err) {
    if (!err.response) throw err
    switch (err.response?.status) {
      case 400:
        throw new ValidationError('Username is already taken')
      case 401:
        throw new UnauthorizedError('You are not a new user')
      default:
        throw err
    }
  }
}

export const logout = () => {
  return api.post('/auth/logout')
}
