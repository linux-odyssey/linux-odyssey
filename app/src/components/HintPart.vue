<template>
  <font-awesome-icon :icon="['far', 'lightbulb']" class="text-yellow-200 p-1" />
  <h1 class="inline text-text font-xl">Hint</h1>
  <div id="hint">
    <!-- <p class="text-text">--Hint--</p> -->
    <p class="text-text">{{ questData.stages }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../utils/api'

const questData = ref(null)
const questErr = ref(null)

api
  .get('/quests/helloworld')
  .then((res) => {
    console.log(res.data)
    questData.value = res.data
  })
  .catch((err) => {
    questErr.value = err
  })
</script>
