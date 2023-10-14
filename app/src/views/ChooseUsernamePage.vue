<script setup>
import { isValidUsername } from '@linux-odyssey/utils'
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'

import api from '../utils/api'

async function checkUsername({ username, error }) {
  const { validation, reason } = isValidUsername(username)
  if (username && !validation) {
    error(`Invalid username. ${reason}`)
    return
  }
  if (username.length > 3) {
    try {
      const { data } = await api.get('/auth/check-username', {
        params: { username },
      })

      const { available } = data
      if (!available) {
        error('Username is already taken.')
      }
    } catch {
      error(`Invalid username. ${reason}`)
    }
  }
}

function handleSubmit({ username, success, error }) {
  api
    .post('/auth/register-from-session', {
      username,
    })
    .then(success)
    .catch((err) => {
      if (err.response?.status === 409) {
        error('Username is already taken.')
      } else {
        console.error(err.message)
        error('Something went wrong.')
      }
    })
}
</script>
<template>
  <div class="relative w-screen h-screen">
    <Background class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="h-2/3 w-1/3">
        <AuthForm
          @onSubmit="handleSubmit"
          @onChange="checkUsername"
          type="username"
          :socialLogin="false"
        />
      </div>
    </div>
  </div>
</template>
