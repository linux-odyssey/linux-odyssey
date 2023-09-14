import { computed, ref, watch } from 'vue'
import api, { setToken } from './api'

const TOKEN_KEY = 'JWT_TOKEN'

const myStorage = window.localStorage
const myToken = ref(myStorage.getItem(TOKEN_KEY))

if (myToken.value) {
  setToken(myToken.value)
}

// watch the token and store it in localStorage
watch(myToken, (newToken) => {
  if (newToken) {
    console.log('update token:', newToken)
    myStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  } else {
    myStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }
})

export const getToken = () => {
  return myToken.value
}

export const login = async (username, password) => {
  try {
    const res = await api.post('/auth/login', { username, password })
    const { token } = res.data
    myToken.value = token
    return true
  } catch (err) {
    if (err.response?.status === 401) {
      return false
    }
    throw err
  }
}

export const register = async (username, email, password) => {
  try {
    const res = await api.post('/auth/register', {
      username,
      password,
      email,
    })
    const { token } = res.data
    myToken.value = token
    return true
  } catch (err) {
    if (err.response?.status === 409) {
      return false
    }
    throw err
  }
}

export const logout = () => {
  myToken.value = null
}

export const isAuthenticated = computed(() => !!myToken.value)
