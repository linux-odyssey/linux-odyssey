<!--Translated-->
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
      error(i18n.t('errors.tooManyRequests'))
      return
    }
    if (err instanceof UnauthorizedError) {
      error(i18n.t('errors.invalidCredentials'))
      return
    }
    if (err instanceof ValidationError) {
      error(err.message)
      return
    }
    console.error(err)
    error(i18n.t('errors.generalError'))
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
        <AuthForm @onSubmit="handleLogin" type="login" />
      </div>
    </div>
  </div>
</template>
