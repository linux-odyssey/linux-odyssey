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
      // error('Too many requests. Try again in 2 minutes.')
      error('太多請求，兩分鐘後再試一次。')
      return
    }
    if (err instanceof UnauthorizedError) {
      // error('Wrong username or password.')
      error('錯誤的帳號名稱或密碼。')
      return
    }
    if (err instanceof ValidationError) {
      // error('Invalid username or password.')
      error('無效的帳號名稱或密碼。')
      return
    }
    console.error(err)
    // error('Something went wrong.')
    error('出了點問題。')
  }
}
</script>
<template>
  <div class="w-screen h-screen">
    <Background class="w-full h-full" />
    <div
      class="w-screen h-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="w-fit">
        <AuthForm  @onSubmit="handleLogin" type="login" />
      </div>
    </div>
  </div>
</template>
