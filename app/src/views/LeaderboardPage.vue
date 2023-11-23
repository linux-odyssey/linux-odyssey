<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../utils/api'

const leaderboard = ref([])

const toast = useToast()
async function getLeaderboard() {
  try {
    const res = await api.get('/leaderboard')
    leaderboard.value = res.data
  } catch (err) {
    console.error(err)
    toast.error('讀取排行榜失敗')
  }
}

onMounted(async () => {
  await getLeaderboard()
})
</script>

<template>
  <div>
    <h1 class="text-text-primary">Leaderboard</h1>
    <div>
      <div class="text-text" v-for="user in leaderboard" :key="user.username">
        {{ user.username }}: {{ user.score }} {{ user.completedQuests }}
      </div>
    </div>
  </div>
</template>
