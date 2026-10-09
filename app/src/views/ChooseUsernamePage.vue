<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isValidUsername } from '../../../packages/utils'
import AuthForm from '../components/AuthForm.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import { TooManyRequestsError, ValidationError } from '../utils/errors'
import { checkUsername, chooseUsername } from '../utils/auth'

const { t } = useI18n()

async function check({
  username,
  error,
}: {
  username: string
  // eslint-disable-next-line no-unused-vars
  error: (msg: string) => void
}) {
  if (username) {
    if (!isValidUsername(username)) {
      error(t('authform_error.invalid_username'))
      return
    }
    try {
      await checkUsername(username)
    } catch (err) {
      if (err instanceof TooManyRequestsError) {
        error(t('authform_error.too_many_requests'))
        return
      }
      if (err instanceof ValidationError) {
        error(err.message)
        return
      }
      error(t('authform_error.auth_failed'))
    }
  }
}

async function handleSubmit({
  username,
  success,
  error,
}: {
  username: string
  success: () => void
  // eslint-disable-next-line no-unused-vars
  error: (msg: string) => void
}) {
  try {
    await chooseUsername(username)
    success()
  } catch (err: any) {
    if (err instanceof TooManyRequestsError) {
      error(t('authform_error.too_many_requests'))
      return
    }
    if (err instanceof ValidationError) {
      error(err.message)
      return
    }
    error(err.message)
  }
}
</script>

<template>
  <div class="w-screen h-screen">
    <DynamicBackground class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <HeaderPart />
      <div class="w-fit">
        <AuthForm
          @onSubmit="handleSubmit"
          @onChange="check"
          type="username"
          :socialLogin="false"
        />
      </div>
    </div>
  </div>
</template>
