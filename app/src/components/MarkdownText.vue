<script setup lang="ts">
import { computed, defineProps } from 'vue'
import markdown2HTML from '../utils/markdown'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const html = computed(() => {
  return markdown2HTML(props.content)
})
</script>

<template>
  <div class="markdown-content" v-html="html"></div>
</template>

<style scoped>
.markdown-content {
  margin: 0;
  padding: 0;
  line-height: 1;
}

.markdown-content :deep(p) {
  line-height: 1.5;
}
.markdown-content :deep(ol) {
  list-style: decimal;
  padding-left: 1em;
}
.markdown-content :deep(code) {
  background-color: #282a33;
  border-radius: 0.25rem;
  padding: 0.25rem;
  font-size: 0.875rem;
}
</style>
