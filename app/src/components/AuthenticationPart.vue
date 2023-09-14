<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../utils/auth'
import api from '../utils/api'

const router = useRouter()
const isRegister = ref(false)
const username = ref('')
const usernameInput = ref(null)
const email = ref('')
const emailInput = ref(null)
const password = ref('')
const errorMessage = ref('')

const success = () => {
  router.push({ name: 'game' })
}

const handleLogin = async () => {
  try {
    const isSuccess = await login(username.value, password.value)
    if (isSuccess) success()
    else errorMessage.value = 'Invalid username or password.'
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Something went wrong.'
  }
}

async function check() {
  const user = username.value.trim()
  try {
    const res = await api.get('/auth/check', {
      params: { username: user },
    })
    // user not exists, try register
    const { type } = res.data
    if (type === 'email') {
      email.value = user
      username.value = ''
    }
    isRegister.value = true
    usernameInput.value.focus()
  } catch (err) {
    if (err.response?.status === 409) {
      // user already exists, try login
      await handleLogin()
      return
    }
    if (err.response?.status === 400) {
      errorMessage.value = 'Invalid username or email.'
      return
    }
    errorMessage.value = 'Something went wrong.'
    console.error(err)
  }
}

async function handleSubmit() {
  if (!isRegister.value) {
    check()
    return
  }
  // register
  console.log('register', username.value, email.value, password.value)
  api
    .get('/auth/check', {
      params: { username: username.value },
    })
    .then(() => {
      // Username is available, now check if the email already exists
      return api.get('/auth/check', { params: { email: email.value } })
    })
    .then(() => {
      // Both username and email are available, proceed with registration
      return register(username.value, email.value, password.value)
    })
    .then((isSuccess) => {
      if (isSuccess) {
        success()
      } else {
        errorMessage.value = 'Something went wrong.'
      }
    })
    .catch((err) => {
      if (err.response?.status === 409) {
        // Handle username or email already exists error here
        if (err.response.data.type === 'username') {
          errorMessage.value = 'Username already exists.'
        } else if (err.response.data.type === 'email') {
          errorMessage.value = 'Email already exists.'
        } else {
          errorMessage.value = 'Something went wrong.'
        }
      } else if (err.response?.status === 400) {
        errorMessage.value = 'Invalid username or email.'
      } else {
        errorMessage.value = 'Something went wrong.'
        console.error(err)
      }
    })
}

const clearError = () => {
  errorMessage.value = ''
}

const goBack = () => {
  isRegister.value = false
}
</script>
<template>
  <!--login page-->
  <div
    class="bg-background border-8 border-background-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <h1 class="text-text-primary text-3xl font-black mb-8">Linux Odyssey</h1>
    <form @submit.prevent="handleSubmit" class="w-full">
      <div class="mb-6">
        <label for="username" class="text-sm font-semibold text-text">{{
          isRegister ? 'Username' : 'Email / Username'
        }}</label
        ><input
          type="text"
          id="username"
          ref="usernameInput"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email or username"
          v-model="username"
          @input="clearError"
          autocomplete="username"
        />
      </div>
      <div class="mb-6" v-if="isRegister">
        <label for="email" class="text-sm font-semibold text-text">Email</label
        ><input
          type="email"
          id="email"
          ref="emailInput"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email or username"
          v-model="email"
          @input="clearError"
          autocomplete="email"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="text-sm font-semibold leading-6 text-text"
          >Password</label
        ><input
          type="password"
          id="password"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your password"
          v-model="password"
          @input="clearError"
        />
      </div>
      <p class="text-red-500 flex justify-center" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <button
        class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-text-primary text-background w-full"
        @click="handleSubmit"
      >
        <span v-if="isRegister">Sign up</span>
        <span v-else>Log in / Sign up</span>
      </button>
      <button
        class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-text-primary text-background w-full"
        v-if="isRegister"
        @click="goBack"
      >
        <span>Back to Login</span>
      </button>
    </form>
  </div>
</template>
