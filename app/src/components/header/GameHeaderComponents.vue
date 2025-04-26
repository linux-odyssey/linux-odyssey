<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { logout } from '../../utils/auth'
import { trpc } from '../../utils/trpc'
import { openBugReport } from '../../utils/formbricks'
import useSession from '../../store/session'
import useUserProfile from '../../store/userProfile'

const userStore = useUserProfile()
const sessionStore = useSession()
const router = useRouter()

const toast = useToast()

const handleLogout = async () => {
  try {
    await logout()
    userStore.resetUserProfile()
    sessionStore.reset()
    router.push({ name: 'login' })
  } catch (err) {
    toast.error('登出失敗')
    console.error(err)
  }
}

const openSurvey = async () => {
  const surveyUrl = await trpc.links.surveyLink.query()
  window.open(surveyUrl, '_blank')
}

onMounted(async () => {
  try {
    await userStore.loadUserProfile()
  } catch (err) {
    toast.error('無法讀取使用者資料')
    console.error(err)
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
    {{ userStore.username }}
  </p>
  <button
    title="Survey"
    target="_blank"
    class="md:h-5 md:w-5 px-1.5 w-auto"
    @click="openSurvey"
  >
    <font-awesome-icon
      :icon="['fas', 'file-invoice']"
      class="text-text-primary inline"
    />
    <span class="text-text sm:hidden px-2">Survey</span>
  </button>
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
  <button
    title="Bug Report"
    @click="openBugReport"
    class="md:h-5 md:w-5 px-1.5 w-auto"
  >
    <font-awesome-icon :icon="['fas', 'bug']" class="text-text-primary" />
    <span class="text-text sm:hidden px-2">Bug Report</span>
  </button>
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
