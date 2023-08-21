<template>
  <section class="h-[10%] p-3 grid grid-cols-3 gap-4 place-content-between">
    <button id="solution" class="bg-background-secondary rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-primary"
      />
      <p class="text-text-primary inline">Solution</p>
    </button>
    <button
      id="reset"
      class="bg-background-secondary rounded-lg p-2"
      @click="reset"
    >
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary"
      />
      <p class="text-text-primary inline">Reset</p>
    </button>
    <button id="continue" class="bg-disabled-background rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-right']"
        class="text-disabled-text"
      />
      <p class="text-disabled-text inline">Continue</p>
    </button>
  </section>
</template>

<script setup>
import sessionManager from '../utils/session'
import socket from '../utils/socket'

const reset = async () => {
  console.log('resetting...')
  await sessionManager.createSession()
  socket.connect(sessionManager.getSession())
}
</script>
