<script setup lang="ts">
import { ref, watch } from 'vue'
import useSession from '../../store/session'
import MarkdownText from '../MarkdownText.vue'

const sessionStore = useSession()
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
  <div class="h-full flex flex-col">
    <div class="flex items-center p-2 h-10">
      <font-awesome-icon
        :icon="['far', 'lightbulb']"
        class="text-yellow-200 p-2 content-center"
      />
      <h1 class="inline text-text w-1/2 font-xl p-2 m-1">提示</h1>
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
    <div id="hint" class="bg-bg p-8 overflow-y-auto">
      <ul>
        <li
          v-for="response in sessionStore.session.responses[current]"
          :key="response.type"
          class="text-text font-xl whitespace-pre-wrap"
        >
          <div v-for="content in response.content" :key="content">
            <MarkdownText :content="content" />
          </div>
        </li>
        <li
          v-for="hint in sessionStore.session.hints[current]"
          :key="hint"
          class="text-text-primary font-xl whitespace-pre-wrap"
        >
          <MarkdownText :content="hint" />
        </li>
      </ul>
      <br />
    </div>
  </div>
</template>
