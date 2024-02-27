<script setup>
import { ref, watch } from 'vue'
import TypewriterText from './TypewriterText.vue'

const { responses } = defineProps({
  responses: {
    type: Array,
    required: true,
  },
})

const current = ref(0)

const next = (length) => {
  if (current.value < length - 1) {
    current.value += 1
  }
  console.log(current.value)
}
console.log(current.value)
console.log(responses)

watch(responses, () => {
  console.log('responses', responses)
  current.value = 0
})
</script>

<template>
  <div class="text-text font-xl whitespace-pre-wrap">
    <p>Current: {{ current }}</p>
    <div v-if="responses" class="flex flex-col items-center">
      <div
        v-for="(response, index) in responses.slice(0, current + 1)"
        :key="response._id"
      >
        <p>Index: {{ index }}</p>
        <TypewriterText
          :content="response.content.join('\n')"
          @done="() => next(responses.length)"
        />
      </div>
    </div>
  </div>
</template>
