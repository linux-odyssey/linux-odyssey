<script setup>
import { onMounted, ref } from 'vue'
import api from '../utils/api'
import sessionManager from '../utils/session'

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
  <div class="h-full w-full max-h-full">
    <h1 id="topic" class="text-red-500" v-if="questErr">
      Failed to get quest infomation
    </h1>
    <h1 id="topic" class="text-text" v-else-if="questData">
      {{ questData.title }}
    </h1>
    <hr class="border-text-tertiary border-2 my-2" />
    <div>
      <div v-if="questData" class="whitespace-pre-wrap">
        <p class="text-text">{{ questData.instruction }}</p>
        <br />
        <p class="text-text">Tasks:</p>
        <ul v-if="sessionManager.session.value">
          <li v-for="task in sessionManager.session.value.tasks" :key="task.id">
            <p v-if="task.completed" class="text-text-primary">
              <span class="">✓</span>
              {{ task.name }}
            </p>
            <p v-else class="text-text">
              <span class="">➤</span>
              {{ task.name }}
            </p>
          </li>
        </ul>
      </div>
      <p class="text-red-500" v-else-if="questErr">{{ questErr.message }}</p>
      <p class="text-text" v-else>Loading...</p>
    </div>
  </div>
</template>
