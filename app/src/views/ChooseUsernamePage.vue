<!--Translated-->
<script setup lang="ts">
import { isValidUsername } from '@linux-odyssey/utils'
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'
import { TooManyRequestsError, ValidationError } from '../utils/errors'
import { checkUsername, chooseUsername } from '../utils/auth'

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
      // error('Invalid username.')
      error(i18n.t('errors.invalidCredentials'))
      return
    }
    try {
      await checkUsername(username)
    } catch (err) {
      if (err instanceof TooManyRequestsError) {
        // error('Too many requests. Try again in 2 minutes.')
        error(i18n.t('errors.tooManyRequests'))
        return
      }
      if (err instanceof ValidationError) {
        error(err.message)
        return
      }
      // error('Something went wrong. Please try again later.')
      error(i18n.t('errors.generalError'))
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
      // error('Too many requests. Try again in 2 minutes.')
      error(i18n.t('errors.tooManyRequests'))
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
    <Background class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
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
