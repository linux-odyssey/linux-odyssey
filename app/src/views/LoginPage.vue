<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthForm from '../components/AuthForm.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import HeaderPart from '../components/header/HeaderPart.vue'

import {
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors'
import { login } from '../utils/auth'

const { t } = useI18n()

const handleLogin = async ({
  username,
  password,
  success,
  error,
}: {
  username: string
  password: string
  success: () => void
  // eslint-disable-next-line no-unused-vars
  error: (msg: string) => void
}) => {
  try {
    const isSuccess = await login(username, password)
    if (isSuccess) success()
  } catch (err) {
    if (err instanceof TooManyRequestsError) {
      error(t('authform_error.too_many_requests'))
      return
    }
    if (err instanceof UnauthorizedError) {
      error(t('authform_error.unauthorized'))
      return
    }
    if (err instanceof ValidationError) {
      error(err.message)
      return
    }
    console.error(err)
    error(t('authform_error.auth_failed'))
  }
}
</script>

<template>
  <div class="w-screen h-screen">
    <DynamicBackground class="w-full h-full" />
    <div
      class="w-screen h-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <HeaderPart />
      <div class="w-fit">
        <AuthForm @onSubmit="handleLogin" type="login" />
      </div>
    </div>
  </div>
</template>
