<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../utils/auth'
import { bugReportUrl } from '../config'
import api from '../utils/api'
import { reset } from '../store/session'

const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    reset()
    router.push({ name: 'login' })
  } catch (err) {
    console.error(err)
  }
}

const questData = ref(null)
const questErr = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/quests/helloworld')
    questData.value = res.data
  } catch (err) {
    questErr.value = err
  }
})
</script>

<template>
  <div id="header" class="bg-bg-secondary content-center h-full w-full p-1">
    <div class="h-full flex items-center justify-center mx-3">
      <div class="flex items-center gap-3">
        <!-- <button id="stream" class="flex items-center h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'bars']"
            class="text-text-primary h-full w-full"
          />
        </button>
        <button id="backward" class="flex items-center h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'arrow-left']"
            class="text-text-tertiary h-full w-full"
          />
        </button> -->
        <button>
          <p
            class="text-text-primary inline-block font-bold whitespace-nowrap"
            v-if="questData"
          >
            {{ questData.title }}
          </p>
        </button>
      </div>
      <div class="h-full w-full flex gap-3 items-center justify-end">
        <!-- <button id="warning" class="flex items-center h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'triangle-exclamation']"
            class="text-text-primary h-full w-full"
          />
        </button>
        <button id="setting" class="flex items-center h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'gear']"
            class="text-text-primary h-full w-full"
          />
        </button>
        <button id="fullscreen" class="flex items-center h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'expand']"
            class="text-text-primary h-full w-full"
          />
        </button> -->
        <a
          title="Bug Report"
          :href="bugReportUrl"
          target="_blank"
          class="h-5 w-5"
        >
          <font-awesome-icon
            :icon="['fas', 'bug']"
            class="text-text-primary h-full w-full"
          />
        </a>
        <button title="Sign Out" @click="handleLogout" class="h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'arrow-right-from-bracket']"
            class="text-text-primary h-full w-full"
          />
        </button>
      </div>
    </div>
  </div>
</template>
