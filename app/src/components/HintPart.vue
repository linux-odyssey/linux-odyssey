<template>
  <div>
    <div v-if="hintData">
      <h3>Hints:</h3>
      <div v-if="currentStageHints">
        <p class="text-text" v-for="hint in currentStageHints" :key="hint">
          {{ hint }}
        </p>
      </div>
    </div>
    <p class="text-text" v-if="hintErr">{{ hintErr.message }}</p>
    {{ currentStageHints }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../utils/api'

const hintData = ref(null)
const hintErr = ref(null)

const currentStage = ref('helloworld')
const currentStageHints = ref([])

api
  .get('/quests/helloworld')
  .then((res) => {
    console.log(res.data)
    hintData.value = res.data
    const currentStageData = hintData.value.stages.find(
      (stage) => stage.id === currentStage.value
    )
    if (currentStageData) {
      currentStageHints.value = currentStageData.hints
    }
  })
  .catch((err) => {
    hintErr.value = err
  })
</script>
