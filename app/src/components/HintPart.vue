<script setup>
import sessionManager from '../utils/session'
</script>

<template>
  <font-awesome-icon :icon="['far', 'lightbulb']" class="text-yellow-200 p-1" />
  <h1 class="inline text-text font-xl">Hint</h1>
  <div id="hint">
    <p class="text-text">--Hint--</p>
    <p class="text-text">{{ sessionManager.hints.value }}</p>
  </div>
</template>
