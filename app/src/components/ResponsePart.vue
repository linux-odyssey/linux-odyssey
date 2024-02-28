<script setup>
import { ref, toRef, watch } from 'vue'
import sessionStore from '../store/session'
import TypewriterText from './TypewriterText.vue'

const props = defineProps({
  current: {
    type: Number,
    required: true,
  },
})

const current = toRef(() => props.current)

const index = ref(0)
const playing = ref(false)

let progress = -1

const next = (length) => {
  if (index.value < length - 1) {
    index.value += 1
  } else {
    playing.value = false
  }
  console.log('next being called', current.value)
}

const getResponse = (i) => {
  return sessionStore.session.responses[i]
}

watch(current, (newCurrent) => {
  console.log('watch being called', current.value, progress)
  if (newCurrent > progress) {
    index.value = 0
    playing.value = true
    progress = newCurrent
  }
})
</script>

<template>
  <div class="text-text font-xl whitespace-pre-wrap">
    <p>Current: {{ current }}</p>
    <p>Playing: {{ playing }}</p>
    <p>Index: {{ index }}</p>
    <p>Responses: {{ getResponse(current) }}</p>
    <div v-if="getResponse(current)">
      <div
        v-for="(response, index) in getResponse(current).slice(0, index + 1)"
        :key="response._id"
      >
        <p>Index: {{ index }}</p>
        <TypewriterText
          :playing="playing"
          :content="response.content.join('\n\n')"
          @done="() => next(getResponse(current).length)"
        />
      </div>
    </div>
  </div>
</template>
