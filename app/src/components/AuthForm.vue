<script setup lang="ts">
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

const availableMethods = ref<{ [key: string]: boolean }>({})
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
  router.push({ name: 'map' })
}

const error = (err: string) => {
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

const registerGuest = async () => {
  try {
    await api.post('/auth/register-guest')
    router.push({ name: 'map' })
  } catch (err) {
    console.error(err)
    toast.error('Something went wrong.')
  }
}
</script>
<template>
  <!-- login page -->
  <div
    class="bg-bg border-8 border-bg-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <div class="w-full flex items-center justify-center mb-2 gap-3">
      <img src="../img/icon_totem.svg" class="h-10" />
      <h1 class="text-text-primary text-3xl font-black" id="title">
        {{ title }}
      </h1>
    </div>
    <div class="text-error inline-flex justify-center items-center md:hidden">
      <font-awesome-icon
        :icon="['fas', 'circle-exclamation']"
        class="px-1 text-sm"
      />
      <span>建議使用電腦全螢幕執行</span>
    </div>
    <form @submit.prevent="handleSubmit()" class="w-full">
      <div v-if="socialLogin && hasSocialLogins">
        <a
          id="GoogleLogin"
          v-if="availableMethods.google"
          class="inline-flex justify-center items-center rounded-lg py-2 mt-3 bg-bg-primary text-text-secondary w-full border-text-secondary border-2"
          href="/api/v1/auth/google"
        >
          <font-awesome-icon
            :icon="['fab', 'google']"
            class="text-text-secondary px-3 text-lg"
          />
          <span class="font-medium"> 以 Google 繼續 </span>
        </a>
        <a
          id="GitHubLogin"
          v-if="availableMethods.github"
          class="inline-flex justify-center items-center rounded-lg py-2 mt-3 bg-bg-primary text-text-secondary w-full border-text-secondary border-2"
          href="/api/v1/auth/github"
        >
          <font-awesome-icon
            :icon="['fab', 'github']"
            class="text-text-secondary px-3 text-lg"
          />
          <span class="font-medium"> 以 GitHub 繼續 </span>
        </a>
        <p
          id="or"
          class="text-text-secondary flex justify-center mt-3"
          v-if="type === 'login' || type === 'register'"
        >
          或
        </p>
      </div>
      <div class="mb-6">
        <input
          type="text"
          id="username"
          ref="usernameInput"
          class="my-4 bg-bg-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-bg-secondary"
          :placeholder="type === 'login' ? '電子郵件 / 帳號名稱' : '帳號名稱'"
          v-model="username"
          required
          @input="handleChange()"
          autocomplete="username"
        />
        <label
          class="text-sm font-normal text-text-secondary"
          id="NameRules"
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
          placeholder="電子郵件"
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
          placeholder="密碼"
          v-model="password"
          required
          @input="handleChange()"
        />
      </div>
      <p
        id="ErrorDisplay"
        class="text-error flex justify-center"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </p>
      <button
        id="LogInOrSignUp"
        class="inline-flex justify-center rounded-lg font-black py-2 bg-text-primary text-bg w-full"
        type="submit"
      >
        <span v-if="type === 'login'"> 登入 </span>
        <span v-else> 註冊 </span>
      </button>

      <p id="SwitchLoginRegister" class="text-text flex justify-center mt-3">
        <span id="CheckRegistered" v-if="type === 'register'">
          已經有帳號了嗎？
          <RouterLink
            id="SwitchtoLogin"
            class="text-text-primary font-bold"
            to="/login"
          >
            <u> 登入 </u>
          </RouterLink></span
        >
        <span id="CheckRegistered" v-else-if="type === 'login'">
          還沒有帳號嗎？
          <RouterLink
            id="SwitchtoRegister"
            class="text-text-primary font-bold"
            to="/register"
          >
            <u> 註冊 </u>
          </RouterLink></span
        >
      </p>
      <button
        id="register-guest"
        class="rounded-lg py-2 mt-3 bg-bg-primary text-text-secondary w-full border-text-secondary border-2"
        @click="registerGuest()"
      >
        以訪客身分繼續
      </button>
    </form>
  </div>
</template>
