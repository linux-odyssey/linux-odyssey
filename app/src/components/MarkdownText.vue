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
  line-height: 1.2;
}
.markdown-content :deep(ul) {
  list-style: disc;
  padding-left: 1em;
  line-height: 1.2;
}
.markdown-content :deep(pre) {
  background-color: #2e3440;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #d8dee9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #4c566a;
  line-height: 1.5;
  font-family: 'monospace';
}

.markdown-content :deep(code:not(pre code)) {
  background-color: #2e3440;
  border-radius: 0.25rem;
  padding: 0.2rem 0.4rem;
  font-size: 0.9rem;
  color: #d8dee9;
  font-family: 'monospace';
}
</style>
