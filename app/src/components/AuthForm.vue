<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../utils/api'

const emit = defineEmits(['onSubmit', 'onChange'])
defineProps({
  type: {
    type: String,
    default: 'login',
  },
  socialLogin: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Linux Odyssey',
  },
})

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const toast = useToast()

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
  router.push({ name: 'game', params: { questId: 'helloworld' } })
}

const error = (err) => {
  errorMessage.value = err
}

const clearError = () => {
  errorMessage.value = ''
}

const handleSubmit = () => {
  if (errorMessage.value) return
  try {
    emit('onSubmit', {
      username: username.value,
      email: email.value,
      password: password.value,
      success,
      error,
    })
  } catch (err) {
    toast.error('Something went wrong.')
    console.error(err)
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
  <!-- login page -->
  <div
    class="bg-bg border-8 border-bg-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <h1 class="text-text-primary text-3xl font-black mb-2">{{ title }}</h1>
    <div class="text-error inline-flex justify-center items-center xl:hidden">
      <font-awesome-icon
        :icon="['fas', 'circle-exclamation']"
        class="px-1 text-sm"
      />
      <span>建議使用電腦全螢幕執行</span>
    </div>
    <form @submit.prevent="handleSubmit()" class="w-full">
      <div v-if="socialLogin && hasSocialLogins">
        <a
          v-if="availableMethods.google"
          class="inline-flex justify-center items-center rounded-lg py-2 mt-3 bg-bg-primary text-text-secondary w-full border-text-secondary border-2"
          href="/api/v1/auth/google"
        >
          <font-awesome-icon
            :icon="['fab', 'google']"
            class="text-text-secondary px-3 text-lg"
          />
          <span class="font-medium">Continue with Google</span>
        </a>
        <a
          v-if="availableMethods.github"
          class="inline-flex justify-center items-center rounded-lg py-2 mt-3 bg-bg-primary text-text-secondary w-full border-text-secondary border-2"
          href="/api/v1/auth/github"
        >
          <font-awesome-icon
            :icon="['fab', 'github']"
            class="text-text-secondary px-3 text-lg"
          />
          <span class="font-medium">Continue with GitHub</span>
        </a>
        <p
          class="text-text-secondary flex justify-center mt-3"
          v-if="type === 'login' || type === 'register'"
        >
          or
        </p>
      </div>
      <div class="mb-6">
        <input
          type="text"
          id="username"
          ref="usernameInput"
          class="my-4 bg-bg-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-bg-secondary"
          :placeholder="type === 'login' ? 'Email / Username' : 'Username'"
          v-model="username"
          required
          @input="handleChange()"
          autocomplete="username"
        />
        <label
          class="text-sm font-normal text-text-secondary"
          v-if="type === 'username' || type === 'register'"
        >
          <p>可用小寫字母、數字、"_"和"-"</p>
          <p>小寫字母開頭，至多32字元</p>
        </label>
      </div>
      <div class="mb-6" v-if="type === 'register'">
        <input
          type="email"
          id="email"
          ref="emailInput"
          class="my-4 bg-bg-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-bg-secondary"
          placeholder="Email"
          v-model="email"
          required
          @input="handleChange()"
          autocomplete="email"
        />
      </div>
      <div class="mb-6" v-if="type === 'login' || type === 'register'">
        <input
          type="password"
          id="password"
          class="my-4 bg-bg-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-bg-secondary"
          placeholder="Password"
          v-model="password"
          required
          @input="handleChange()"
        />
      </div>
      <p class="text-error flex justify-center" v-if="errorMessage">
        {{ errorMessage }}
      </p>
      <button
        class="inline-flex justify-center rounded-lg font-black py-2 bg-text-primary text-bg w-full"
        type="submit"
      >
        <span v-if="type === 'login'">Log In</span>
        <span v-else>Sign Up</span>
      </button>

      <p class="text-text flex justify-center mt-3">
        <span v-if="type === 'register'"
          >Already have an account?
          <RouterLink class="text-text-primary font-bold" to="/login">
            <u>Log in</u>
          </RouterLink></span
        >
        <span v-else-if="type === 'login'"
          >Don't have an account?
          <RouterLink class="text-text-primary font-bold" to="/register">
            <u>Sign up</u>
          </RouterLink></span
        >
      </p>
    </form>
  </div>
</template>
