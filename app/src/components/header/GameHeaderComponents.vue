<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { logout } from '../../utils/auth'
import { bugReportUrl, surveyUrl } from '../../config'
import { reset } from '../../store/session'
import userProfileStore, {
  loadUserProfile,
  resetUserProfile,
} from '../../store/userProfile'

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
    class="text-text inline-block whitespace-nowrap px-1.5"
    style="font-size: 2vh"
  >
    {{ userProfileStore.username }}
  </p>
  <a
    title="Survey"
    :href="surveyUrl"
    target="_blank"
    class="md:h-5 md:w-5 px-1.5 w-auto"
  >
    <font-awesome-icon
      :icon="['fas', 'file-invoice']"
      class="text-text-primary inline"
    />
    <span class="text-text sm:hidden px-2">Survey</span>
  </a>
  <RouterLink
    title="LeaderBoard"
    to="/leaderboard"
    class="md:h-5 md:w-5 px-1.5 w-auto"
  >
    <font-awesome-icon :icon="['fas', 'trophy']" class="text-text-primary" />
    <span class="text-text sm:hidden px-2">Leader Board</span>
  </RouterLink>
  <RouterLink title="Map" to="/map" class="md:h-5 md:w-5 px-1.5 w-auto">
    <font-awesome-icon :icon="['fas', 'map']" class="text-text-primary" />
    <span class="text-text sm:hidden px-2">Map</span>
  </RouterLink>
  <a
    title="Bug Report"
    :href="bugReportUrl"
    target="_blank"
    class="md:h-5 md:w-5 px-1.5 w-auto"
  >
    <font-awesome-icon :icon="['fas', 'bug']" class="text-text-primary" />
    <span class="text-text sm:hidden px-2">Bug Report</span>
  </a>
  <button
    title="Sign Out"
    @click="handleLogout"
    class="md:h-5 md:w-5 px-1.5 w-auto"
  >
    <font-awesome-icon
      :icon="['fas', 'arrow-right-from-bracket']"
      class="text-text-primary"
    />
    <span class="text-text sm:hidden px-2">Sign Out</span>
  </button>
</template>
