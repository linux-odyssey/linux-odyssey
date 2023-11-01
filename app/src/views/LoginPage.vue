<script setup>
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'

import {
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors'
import { login } from '../utils/auth'

const handleLogin = async ({ username, password, success, error }) => {
  try {
    const isSuccess = await login(username, password)
    if (isSuccess) success()
  } catch (err) {
    if (err instanceof TooManyRequestsError) {
      error('Too many requests. Try again in 2 minutes.')
      return
    }
    if (err instanceof UnauthorizedError) {
      error('Wrong username or password.')
      return
    }
    if (err instanceof ValidationError) {
      error('Invalid username or password.')
      return
    }
    console.error(err)
    error('Something went wrong.')
  }
}
</script>
<template>
  <div class="relative w-screen h-screen">
    <Background class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="w-1/3">
        <AuthForm @onSubmit="handleLogin" type="login" />
      </div>
    </div>
  </div>
</template>
