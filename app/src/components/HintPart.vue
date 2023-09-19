<script setup>
import sessionManager from '../utils/session'
</script>

<template>
  <font-awesome-icon :icon="['far', 'lightbulb']" class="text-yellow-200 p-1" />
  <h1 class="inline text-text font-xl">Hint</h1>
  <div id="hint">
    <div
      class="bg-background h-full rounded-lg"
      v-for="hint in sessionManager.hints.value"
      :key="hint.id"
    >
      <p class="text-text">
        {{ hint }}
      </p>
      <br />
    </div>
  </div>
</template>
