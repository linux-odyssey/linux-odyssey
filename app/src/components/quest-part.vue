<script setup>
import { ref } from 'vue'

const questData = ref(null)
const questErr = ref(null)

fetch('https://odyssey.wancat.cc/api/v1/quests/helloworld')
  .then((res) => res.json())
  .then((json) => {
    questData.value = JSON.stringify(json.content)
  })
  .catch((err) => {
    questErr.value = err
  })
</script>

<template>
  <h1 id="topic" class="text-text">Try Your First Command</h1>
  <hr class="border-text-line border-2 my-2" />
  <div>
    <p class="text-red-500" v-if="questErr">{{ questErr.message }}</p>
    <p class="text-text" v-else-if="questData">--Quest Information--</p>
    <!--
    <p class="text-text" v-else-if="quest" v-html="questData"></p>
    -->
    <p class="text-text" v-else>Loading...</p>
  </div>
</template>
