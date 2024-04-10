<!--Translated-->
<script setup>
import validator from 'validator'
import { isValidUsername } from '@linux-odyssey/utils'
import { passwordPolicy } from '@linux-odyssey/constants'
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'

import { checkUsername, register } from '../utils/auth'
import {
  UnauthorizedError,
  TooManyRequestsError,
  ValidationError,
} from '../utils/errors'

function handleRegister({ username, email, password, success, error }) {
  register(username, email, password)
    .then(success)
    .catch((err) => {
      if (err instanceof TooManyRequestsError) {
        error(i18n.t('errors.tooManyRequests')) // Assuming 'errors.tooManyRequests' is the key in your i18n file
        return
      }
      if (err instanceof UnauthorizedError) {
        error(i18n.t('errors.invalidCredentials'))
        return
      }
      if (err instanceof ValidationError) {
        error(i18n.t('errors.validationError'))
        return
      }
      console.error(err)
      error(i18n.t('errors.generalError'))
    })
}

async function check({ username, email, password, error }) {
  if (username && !isValidUsername(username)) {
    error(i18n.t('errors.invalidUsername'))
    return
  }
  if (email && !validator.isEmail(email)) {
    error(i18n.t('errors.invalidEmail'))
    return
  }
  if (password && !validator.isStrongPassword(password, passwordPolicy)) {
    error(i18n.t('errors.weakPassword'))
    return
  }
  try {
    await checkUsername(username)
  } catch (err) {
    if (err instanceof ValidationError) {
      error(err.message)
      return
    }
    if (err instanceof TooManyRequestsError) {
      error(i18n.t('errors.tooManyRequests'))
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
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="w-fit">
        <AuthForm
          @onSubmit="handleRegister"
          @onChange="check"
          type="register"
        />
      </div>
    </div>
  </div>
</template>
