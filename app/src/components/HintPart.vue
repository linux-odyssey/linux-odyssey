<script setup>
import { ref, watch } from 'vue'
import sessionStore from '../store/session'

const current = ref(-1)
watch(
  () => sessionStore.session.hints,
  (hints) => {
    current.value = hints.length - 1
  },
  { deep: true }
)

const left = () => {
  if (current.value > 0) {
    current.value -= 1
  }
}

const right = () => {
  if (current.value < sessionStore.session.hints.length - 1) {
    current.value += 1
  }
}
</script>

<template>
  <div class="w-full flex items-center p-2">
    <font-awesome-icon
      :icon="['far', 'lightbulb']"
      class="text-yellow-200 p-2 content-center"
    />
    <h1 class="inline text-text font-xl p-2 m-1">Hint</h1>
    <div v-if="current !== -1" class="w-full flex justify-end">
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
        {{ sessionStore.session.hints.length }}
      </p>
      <button
        class="p-2 m-1 w-1/8"
        id="Rbutton"
        @click="right"
        :disabled="current === sessionStore.session.hints.length - 1"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-text" />
      </button>
    </div>
  </div>
  <div id="hint" class="bg-bg flex flex-wrap p-8">
    <ul>
      <li
        v-for="hint in sessionStore.session.hints[current]"
        :key="hint"
        class="text-text font-xl whitespace-pre-wrap"
      >
        {{ hint }}
      </li>
    </ul>
    <br />
  </div>
</template>
