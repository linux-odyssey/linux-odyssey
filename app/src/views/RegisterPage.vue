<script setup>
import validator from 'validator'
import { isValidUsername } from '@linux-odyssey/utils'
import { passwordPolicy } from '@linux-odyssey/constants'
import AuthForm from '../components/AuthForm.vue'
import Background from '../components/DynamicBackground.vue'

import api from '../utils/api'
import { register } from '../utils/auth'

function handleRegister({ username, email, password, success, error }) {
  register(username, email, password)
    .then(success)
    .catch((err) => {
      if (err.response?.status === 409) {
        // Handle username or email already exists error here
        if (err.response.data.type === 'username') {
          error('Username already exists.')
        } else if (err.response.data.type === 'email') {
          error('Email already exists.')
        } else {
          error('Something went wrong.')
        }
      } else if (err.response?.status === 400) {
        error('Invalid username or email.')
      } else {
        console.error(err)
      }
    })
}

async function check({ username, email, password, error }) {
  if (username && !isValidUsername(username)) {
    error('Invalid username.')
    return
  }
  if (email && !validator.isEmail(email)) {
    error('Invalid email.')
    return
  }
  if (password && !validator.isStrongPassword(password, passwordPolicy)) {
    error(
      'Your password must be 8+ characters with at least one number, one upper and one lower case letter.'
    )
    return
  }
  if (!(username && email && password)) {
    return
  }
  try {
    const res = await api.get('/auth/check-username', {
      params: { username },
    })
    const { available } = res.data
    if (!available) {
      error(`Username already exists.`)
    }
  } catch (err) {
    if (err.response?.status === 400) {
      error('Invalid username.')
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
        <AuthForm
          @onSubmit="handleRegister"
          @onChange="check"
          type="register"
        />
      </div>
    </div>
  </div>
</template>
