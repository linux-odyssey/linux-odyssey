<script setup>
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'

import { login } from '../utils/auth'

const handleLogin = async ({ username, password, success, error }) => {
  try {
    const isSuccess = await login(username, password)
    if (isSuccess) success()
    else error('Wrong username or password.')
  } catch (err) {
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
