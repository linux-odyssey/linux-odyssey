<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import MarkdownText from './MarkdownText.vue'

const i = ref(0)
let intervalId = null

const { content, playing } = defineProps({
  content: {
    type: String,
    required: true,
  },
  playing: {
    type: Boolean,
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
  console.log('TypeWriterText mounted')
  if (playing) {
    startTyping()
  } else {
    displayText.value = content
  }
})

const displayText = computed(() => {
  return content.slice(0, i.value)
})
</script>

<template>
  <MarkdownText v-if="playing" :content="displayText" />
  <MarkdownText v-else :content="content" />
</template>
