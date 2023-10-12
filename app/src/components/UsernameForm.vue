<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

const username = ref('')
const errorMessage = ref('')
const router = useRouter()

async function checkUsername() {
  const user = username.value.trim()
  errorMessage.value = ''
  if (user.length > 3) {
    try {
      const { data } = await api.get('/auth/check-username', {
        params: { username: user },
      })

      const { available } = data
      if (!available) {
        errorMessage.value = 'Username is already taken.'
      } else {
        errorMessage.value = ''
      }
    } catch {
      errorMessage.value = 'Invalid username.'
    }
  }
}

async function handleSubmit() {
  if (errorMessage.value) {
    return
  }
  try {
    const { data } = await api.post('/auth/register-from-session', {
      username: username.value.trim(),
    })
    console.log(data)
    router.push({ name: 'game' })
  } catch (err) {
    console.error(err.message)
    if (err.response?.status === 409) {
      errorMessage.value = 'Username is already taken.'
    } else {
      errorMessage.value = 'Something went wrong.'
    }
  }
}
</script>
<template>
  <div
    class="bg-background border-8 border-background-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <h1 class="text-text-primary text-3xl font-black mb-8">Choose username</h1>
    <form @submit.prevent="handleSubmit" class="w-full">
      <div class="mb-6">
        <label for="username" class="text-sm font-semibold text-text"
          >Username</label
        ><input
          type="text"
          id="username"
          ref="usernameInput"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email or username"
          v-model="username"
          @input="checkUsername"
          autocomplete="username"
        />
      </div>
      <p class="text-red-500 flex justify-center" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <button
        class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-text-primary text-background w-full"
        type="submit"
      >
        <span>Sign up</span>
      </button>
    </form>
  </div>
</template>
