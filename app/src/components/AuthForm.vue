<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../utils/api'

const emit = defineEmits(['onSubmit', 'onChange'])
const props = defineProps({
  isRegister: Boolean,
})

console.log(typeof props.isRegister)

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const availableMethods = ref({})
onMounted(async () => {
  const res = await api.get('/auth/available-methods')
  availableMethods.value = res.data
})

const hasSocialLogins = computed(() => {
  // There is any key other than 'local' is true
  return Object.keys(availableMethods.value).some(
    (method) => method !== 'local' && availableMethods.value[method]
  )
})

const success = () => {
  router.push({ name: 'game' })
}

const error = (err) => {
  console.error(err)
  errorMessage.value = err
}

const clearError = () => {
  errorMessage.value = ''
}

const handleSubmit = () => {
  clearError()
  try {
    emit('onSubmit', {
      username: username.value,
      email: email.value,
      password: password.value,
      success,
      error,
    })
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Something went wrong'
  }
}

const handleChange = () => {
  clearError()
  try {
    emit('onChange', {
      username: username.value,
      email: email.value,
      password: password.value,
      success,
      error,
    })
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Something went wrong'
  }
}
</script>
<template>
  <!--login page-->
  <div
    class="bg-background border-8 border-background-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <h1 class="text-text-primary text-3xl font-black mb-8">Linux Odyssey</h1>
    <form @submit.prevent="handleSubmit()" class="w-full">
      <div class="mb-6">
        <label for="username" class="text-sm font-semibold text-text">{{
          isRegister ? 'Username' : 'Email / Username'
        }}</label
        ><input
          type="text"
          id="username"
          ref="usernameInput"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email or username"
          v-model="username"
          @input="handleChange()"
          autocomplete="username"
        />
      </div>
      <div class="mb-6" v-if="isRegister">
        <label for="email" class="text-sm font-semibold text-text">Email</label
        ><input
          type="email"
          id="email"
          ref="emailInput"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email or username"
          v-model="email"
          @input="handleChange()"
          autocomplete="email"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="text-sm font-semibold leading-6 text-text"
          >Password</label
        ><input
          type="password"
          id="password"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your password"
          v-model="password"
          @input="handleChange()"
        />
      </div>
      <p class="text-red-500 flex justify-center" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <button
        class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-text-primary text-background w-full"
        type="submit"
      >
        <span v-if="isRegister">Register</span>
        <span v-else>Log in</span>
      </button>

      <p class="text-text flex justify-center mt-3">
        <span v-if="isRegister"
          >Already have an account?
          <RouterLink class="text-text-primary" to="/login"
            >Log in</RouterLink
          ></span
        >
        <span v-else
          >Don't have an account?
          <RouterLink class="text-text-primary" to="/register"
            >Register</RouterLink
          ></span
        >
      </p>

      <div v-if="hasSocialLogins">
        <hr class="my-8" />
        <p class="flex justify-center font-semibold text-text text-base">
          Log in with social account
        </p>
        <a
          v-if="availableMethods.google"
          class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-icon-google text-text w-full"
          href="/api/v1/auth/google"
        >
          <span>Google</span>
        </a>
        <a
          v-if="availableMethods.github"
          class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-icon-github text-text w-full"
          href="/api/v1/auth/github"
        >
          <span>GitHub</span>
        </a>
      </div>
    </form>
  </div>
</template>
