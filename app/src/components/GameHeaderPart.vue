<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { logout } from '../utils/auth'
import { bugReportUrl, surveyUrl } from '../config'
import { reset } from '../store/session'
import userProfileStore, {
  loadUserProfile,
  resetUserProfile,
} from '../store/userProfile'

const router = useRouter()

const toast = useToast()

const handleLogout = async () => {
  try {
    await logout()
    resetUserProfile()
    reset()
    router.push({ name: 'login' })
  } catch (err) {
    // toast.error('Failed to logout')
    toast.error('登出失敗')
    console.error(err)
  }
}

defineProps({
  title: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  try {
    await loadUserProfile()
  } catch (err) {
    // toast.error('Failed to load user profile')
    toast.error('無法讀取使用者資料')
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
            class="text-border h-full w-full"
          />
        </button> -->
        <img src="../img/icon_totem.svg" class="h-5" />
        <button
          id="GameTitle"
          class="text-text-primary inline-block font-bold whitespace-nowrap"
          style="font-size: 2vh"
        >
          Linux Odyssey
        </button>
        <p
          id="QuestTitle"
          class="text-text inline-block font-bold whitespace-nowrap"
          style="font-size: 2vh"
        >
          {{ title }}
        </p>
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
        <p
          id="UsernameText"
          class="text-text inline-block whitespace-nowrap"
          style="font-size: 2vh"
        >
          {{ userProfileStore.username }}
        </p>
        <a title="Survey" :href="surveyUrl" target="_blank" class="h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'file-invoice']"
            class="text-text-primary h-full w-full"
          />
        </a>
        <RouterLink title="LeaderBoard" to="/leaderboard" class="h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'trophy']"
            class="text-text-primary h-full w-full"
          />
        </RouterLink>
        <RouterLink title="Map" to="/map" class="h-5 w-5">
          <font-awesome-icon
            :icon="['fas', 'map']"
            class="text-text-primary h-full w-full"
          />
        </RouterLink>
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
