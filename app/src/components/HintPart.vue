<script setup>
import { ref, watch } from 'vue'
import sessionManager from '../utils/session'

const current = ref(-1)
watch(sessionManager.hints, (hints) => {
  current.value = hints.length - 1
})

const left = () => {
  if (current.value > 0) {
    current.value -= 1
  }
}

const right = () => {
  if (current.value < sessionManager.hints.value.length - 1) {
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
    <div v-if="current !== -1">
      <button
        class="p-2 m-1 w-1/8"
        id="Lbutton"
        @click="left"
        :disabled="current <= 0"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          class="text-text"
          rotation="180"
        />
      </button>
      <p class="inline text-text font-xl w-1/14 p-2 m-1">{{ current + 1 }}</p>
      <p class="inline text-text font-xl w-1/14 p-2 m-1">/</p>
      <p class="inline text-text font-xl w-1/14 p-2 m-1">
        {{ sessionManager.hints.value.length }}
      </p>
      <button
        class="p-2 m-1 w-1/8"
        id="Rbutton"
        @click="right"
        :disabled="current === sessionManager.hints.value.length - 1"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-text" />
      </button>
    </div>
  </div>
  <div id="hint" class="bg-bg flex flex-wrap">
    <div class="bg-bg h-full rounded-lg p-8 m-1">
      <p class="inline text-text font-xl font-xl">
        {{ sessionManager.hints.value[current] }}
      </p>
      <br />
    </div>
  </div>
</template>
