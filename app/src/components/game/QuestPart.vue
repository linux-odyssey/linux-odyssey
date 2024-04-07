<script setup lang="ts">
import { computed } from 'vue'
import MarkdownText from '../MarkdownText.vue'
import sessionStore from '../../store/session'
import { Task } from '../../types'

const tasks = computed(() => {
  return sessionStore.session.tasks.map((task: Task) => {
    const prefix = task.completed ? '✓' : '➤'
    const color = task.completed ? 'text-text-primary' : 'text-text'
    return {
      ...task,
      class: `${color} markdown-content`,
      content: `${prefix} ${task.name}`,
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
        <MarkdownText
          class="text-text markdown-content"
          :content="sessionStore.quest.instruction"
        />
        <br />
        <p id="tasks" class="text-text">任務：</p>
        <ul v-if="sessionStore.session">
          <li v-for="task in tasks" :key="task.id">
            <MarkdownText :class="task.class" :content="task.content" />
          </li>
        </ul>
      </div>
      <p class="text-text" v-else>Loading...</p>
    </div>
  </div>
</template>
