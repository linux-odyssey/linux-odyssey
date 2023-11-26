<script setup>
import { ref, watch, computed } from 'vue'
import sessionStore from '../store/session'
import markdown2HTML from '../utils/markdown'

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

const hints = computed(() => {
  return sessionStore.session.hints.map((stageHints) =>
    stageHints.map(markdown2HTML)
  )
})
</script>

<template>
  <div class="w-full flex items-center p-2">
    <font-awesome-icon
      :icon="['far', 'lightbulb']"
      class="text-yellow-200 p-2 content-center"
    />
    <h1 class="inline text-text w-1/2 font-xl p-2 m-1">
      <!-- Hint -->
      提示
    </h1>
    <div v-if="current !== -1" class="flex w-full justify-end items-end">
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
        {{ hints.length }}
      </p>
      <button
        class="p-2 m-1 w-1/8"
        id="Rbutton"
        @click="right"
        :disabled="current === hints.length - 1"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="text-text" />
      </button>
    </div>
  </div>
  <div id="hint" class="bg-bg flex flex-wrap p-8">
    <ul>
      <li
        v-for="hint in hints[current]"
        :key="hint"
        class="text-text font-xl whitespace-pre-wrap"
        v-html="hint"
      ></li>
    </ul>
    <br />
  </div>
</template>
