<script setup>
import sessionStore from '../store/session'
</script>

<template>
  <div class="h-full w-full max-h-full">
    <p id="topic" class="text-text font-black" v-if="sessionStore.quest">
      {{ sessionStore.quest.title }}
    </p>
    <br />
    <div>
      <div v-if="sessionStore.quest" class="whitespace-pre-wrap">
        <p class="text-text">{{ sessionStore.quest.instruction }}</p>
        <hr class="border-border border-2 my-2" />
        <p class="text-text">Tasks:</p>
        <ul v-if="sessionStore.session">
          <li v-for="task in sessionStore.session.tasks" :key="task.id">
            <p v-if="task.completed" class="text-text-primary">
              <span class="">✓</span>
              {{ task.name }}
            </p>
            <p v-else class="text-text">
              <span class="">➤</span>
              {{ task.name }}
            </p>
          </li>
        </ul>
      </div>
      <p class="text-text" v-else>Loading...</p>
    </div>
  </div>
</template>
