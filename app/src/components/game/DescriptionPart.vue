<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useSession from '../../store/session'
import MarkdownText from '../MarkdownText.vue'

const sessionStore = useSession()
const current = ref(-1)
const hintDetails = ref<HTMLDetailsElement | null>(null)
const length = computed(() => {
  return sessionStore.session?.responses?.length ?? 0
})

const disabled = computed(() => {
  return current.value === length.value - 1
})

watch(length, () => {
  console.log('length update', length.value)
  current.value = length.value - 1
})

const left = () => {
  if (current.value > 0) {
    current.value -= 1
  }
}

const right = () => {
  if (current.value < length.value - 1) {
    current.value += 1
  }
}

const response = computed(() => {
  if (!sessionStore.session) return null
  if (current.value < 0) return null
  if (current.value >= sessionStore.session.responses.length) return null
  return sessionStore.session.responses[current.value]
})

watch(response, () => {
  if (hintDetails.value) {
    hintDetails.value.open = false
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center p-2 h-10">
      <font-awesome-icon
        :icon="['far', 'lightbulb']"
        class="text-yellow-200 p-2 content-center"
      />
      <h1 class="inline text-text w-1/2 font-xl p-2 m-1">說明</h1>
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
          {{ length }}
        </p>
        <button
          class="p-2 m-1 w-1/8"
          id="Rbutton"
          @click="right"
          :disabled="disabled"
        >
          <font-awesome-icon
            :icon="['fas', 'arrow-right']"
            :class="disabled ? 'text-gray-600' : 'text-text'"
          />
        </button>
      </div>
    </div>
    <div id="hint" class="bg-bg p-8 overflow-y-auto">
      <ul>
        <li
          v-if="response"
          :key="response.type"
          class="text-text font-xl whitespace-pre-wrap"
        >
          <MarkdownText :content="response.content" />
        </li>
        <li
          v-if="response?.hint"
          class="text-text-primary font-xl whitespace-pre-wrap"
        >
          <details ref="hintDetails">
            <summary class="cursor-pointer">提示</summary>
            <MarkdownText :content="response.hint" />
          </details>
        </li>
      </ul>
      <br />
    </div>
  </div>
</template>
