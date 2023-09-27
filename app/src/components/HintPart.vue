<script setup>
import { ref } from 'vue'
import sessionManager from '../utils/session'

const current = ref(1)
const left = () => {
  if (current.value > 1) {
    current.value -= 1
  }
}
const right = () => {
  if (current.value < sessionManager.hints.value.length) {
    current.value += 1
  }
}
</script>

<template>
  <div class="flex flex-wrap">
    <font-awesome-icon
      :icon="['far', 'lightbulb']"
      class="text-yellow-200 p-2"
    />
    <h1 class="inline text-text font-xl w-7/12 p-2 m-1">Hint</h1>
    <button class="p-2 m-1 w-1/7" id="Lbutton" @click="left">
      <font-awesome-icon
        :icon="['fas', 'arrow-right']"
        style="color: #deddda"
        rotation="180"
      />
    </button>
    <p class="inline text-text font-xl w-1/14 p-2 m-1">{{ current }}</p>
    <p class="inline text-text font-xl w-1/14 p-2 m-1">/</p>
    <p class="inline text-text font-xl w-1/14 p-2 m-1">
      {{ sessionManager.hints.value.length }}
    </p>
    <button class="p-2 m-1 w-1/7" id="Rbutton" @click="right">
      <font-awesome-icon
        :icon="['fas', 'arrow-right']"
        style="color: #deddda"
      />
    </button>
  </div>
  <div id="hint" class="bg-background flex flex-wrap">
    <div class="bg-background h-full rounded-lg p-8 m-1">
      <p class="inline text-text font-xl font-xl">
        {{ sessionManager.hints.value[current - 1] }}
      </p>
      <br />
    </div>
  </div>
</template>
