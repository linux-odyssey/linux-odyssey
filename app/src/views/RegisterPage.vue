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
        // error('Too many requests. Try again in 2 minutes.')
        error('太多請求，兩分鐘後再試一次。')
        return
      }
      if (err instanceof UnauthorizedError) {
        // error('Invalid username or password.')
        error('無效的帳號名稱或密碼。')
        return
      }
      if (err instanceof ValidationError) {
        error(err.message)
        return
      }
      console.error(err)
      // error('Something went wrong.')
      error('出了點問題。')
    })
}

async function check({ username, email, password, error }) {
  if (username && !isValidUsername(username)) {
    // error('Invalid username.')
    error('無效的帳號名稱')
    return
  }
  if (email && !validator.isEmail(email)) {
    // error('Invalid email.')
    error('無效的電子郵件')
    return
  }
  if (password && !validator.isStrongPassword(password, passwordPolicy)) {
    // error(
    //   'Your password must be 8+ characters with at least one number, one upper and one lower case letter.'
    // )
    error('密碼必須超過8個字元，至少包含一個數字、一個大寫及一個小寫。')
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
      // error('Too many requests. Try again in 2 minutes.')
      error('太多請求，兩分鐘後再試一次。')
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
