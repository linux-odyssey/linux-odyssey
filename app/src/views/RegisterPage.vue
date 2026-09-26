<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import validator from 'validator'
import { isValidUsername } from '../../../packages/utils'
import { passwordPolicy } from '../../../packages/constants'
import AuthForm from '../components/AuthForm.vue'
import DynamicBackground from '../components/DynamicBackground.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import { checkUsername, register } from '../utils/auth'
import {
  UnauthorizedError,
  TooManyRequestsError,
  ValidationError,
} from '../utils/errors'

const { t } = useI18n()

function handleRegister({
  username,
  email,
  password,
  success,
  error,
}: {
  username: string
  email: string
  password: string
  success: () => void
  // eslint-disable-next-line no-unused-vars
  error: (msg: string) => void
}) {
  register(username, email, password)
    .then(success)
    .catch((err) => {
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
    })
}

async function check({
  username,
  email,
  password,
  error,
}: {
  username: string
  email: string
  password: string
  // eslint-disable-next-line no-unused-vars
  error: (msg: string) => void
}) {
  if (username && !isValidUsername(username)) {
    error(t('authform_error.invalid_username'))
    return
  }
  if (email && !validator.isEmail(email)) {
    error(t('authform_error.invalid_email'))
    return
  }
  if (password && !validator.isStrongPassword(password, passwordPolicy)) {
    error(t('authform_error.invalid_password'))
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
      error(t('authform_error.too_many_requests'))
      return
    }
    console.error(err)
    error(t('authform_error.registration_failed'))
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
      <div class="w-fit mt-8">
        <AuthForm
          @onSubmit="handleRegister"
          @onChange="check"
          type="register"
        />
      </div>
    </div>
  </div>
</template>
