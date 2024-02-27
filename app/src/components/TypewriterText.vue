<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import MarkdownText from './MarkdownText.vue'

const i = ref(0)
let intervalId = null

const { content } = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['done'])

const startTyping = () => {
  intervalId = setInterval(() => {
    if (i.value < content.length) {
      i.value += 1
    } else {
      clearInterval(intervalId)
      emit('done')
    }
  }, 100)
}

onMounted(() => {
  startTyping()
})

const displayText = computed(() => {
  return content.slice(0, i.value)
})
</script>

<template>
  <MarkdownText :content="displayText" />
</template>
