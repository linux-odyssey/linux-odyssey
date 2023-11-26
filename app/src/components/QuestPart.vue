<script setup>
import { computed } from 'vue'
import sessionStore from '../store/session'
import markdown2HTML from '../utils/markdown'

const instruction = computed(() => {
  return markdown2HTML(sessionStore.quest.instruction)
})

const tasks = computed(() => {
  return sessionStore.session.tasks.map((task) => {
    const prefix = task.completed ? '✓' : '➤'
    const color = task.completed ? 'text-text-primary' : 'text-text'
    return {
      ...task,
      class: `${color} markdown-content`,
      content: markdown2HTML(`${prefix} ${task.name}`),
    }
  })
})
</script>

<template>
  <div class="h-full w-full max-h-full">
    <p id="topic" class="text-text font-black" v-if="sessionStore.quest">
      {{ sessionStore.quest.title }}
    </p>
    <br />
    <div>
      <div v-if="sessionStore.quest" class="whitespace-pre-wrap">
        <p class="text-text markdown-content" v-html="instruction"></p>
        <br />
        <p id="tasks" class="text-text">
          <!-- Tasks: -->
          任務：
        </p>
        <ul v-if="sessionStore.session">
          <li
            v-for="task in tasks"
            :key="task.id"
            :class="task.class"
            v-html="task.content"
          ></li>
        </ul>
      </div>
      <p class="text-text" v-else>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.markdown-content :deep(p) {
  margin: 0;
  color: 'red';
  padding: 0;
}

.markdown-content :deep(code) {
  background-color: #282a33;
  border-radius: 0.25rem;
  padding: 0.25rem;
  font-size: 0.875rem;
}
</style>
