<!--Translated-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import DynamicBackground from '../components/DynamicBackground.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'
import api from '../utils/api'
import i18n from '../i18n'

const leaderboard = ref<
  {
    username: string
    score: number
    completedQuests: string[]
  }[]
>([])

const toast = useToast()
async function getLeaderboard() {
  try {
    const res = await api.get('/leaderboard')
    leaderboard.value = res.data
  } catch (err: any) {
    console.error(err)
    toast.error(i18n.t('leaderborad.errorLoadFail'))
  }
}

onMounted(async () => {
  await getLeaderboard()
})
</script>

<template>
  <div class="w-screen h-screen bg-bg">
    <DynamicBackground class="w-full h-full" />
    <div
      class="w-screen h-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="w-full">
        <GameHeaderPart :title="$t('leaderboard.i')" />
      </div>
      <div class="w-fit h-[94vh] m-3">
        <div
          class="h-full bg-bg border-8 border-bg-primary flex flex-col items-center rounded-3xl p-10"
        >
          <h1 class="text-text-primary text-3xl mb-5">
            {{ $t('leaderboard.i') }}
          </h1>
          <div class="max-h-300 overflow-auto">
            <table class="w-full text-sm text-left text-text">
              <thead
                class="text-xs text-text-secondary uppercase bg-bg-secondary"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">
                    {{ $t('leaderboard.i') }}
                  </th>
                  <th scope="col" class="px-6 py-3">
                    {{ $t('leaderboard.score') }}
                  </th>
                  <th scope="col" class="px-6 py-3">
                    {{ $t('leaderboard.finish') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in leaderboard"
                  :key="user.username"
                  class="border-b bg-bg"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-text-primary whitespace-nowrap"
                  >
                    {{ user.username }}
                  </th>
                  <td class="px-6 py-4">{{ user.score }}</td>
                  <td class="px-6 py-4 text-text-secondary">
                    <span
                      class="mr-2"
                      v-for="quest in user.completedQuests"
                      :key="quest"
                    >
                      {{ quest }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
