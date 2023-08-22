<script setup>
import { ref } from 'vue'
import api from '../utils/api'

const questData = ref(null)
const questErr = ref(null)

api
  .get('/quests/helloworld')
  .then((res) => {
    console.log(res.data)
    questData.value = JSON.stringify(res.data.instruction)
    questData.value = '--Quest Information--'
  })
  .catch((err) => {
    questErr.value = err
  })
</script>

<template>
  <div class="overflow-auto h-full w-full max-h-full">
    <h1 id="topic" class="text-text">Try Your First Command</h1>
    <hr class="border-text-line border-2 my-2" />
    <div>
      <p class="text-red-500" v-if="questErr">{{ questErr.message }}</p>
      <p class="text-text" v-else-if="questData" v-html="questData"></p>
      <p class="text-text" v-else>Loading...</p>
    </div>
  </div>
</template>
