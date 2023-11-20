<template>
  <section class="h-[10%] p-3 grid grid-cols-3 gap-4 place-content-between">
    <button id="solution" class="bg-bg-disabled rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-question']"
        class="text-text-disabled"
      />
      <p class="text-text-disabled inline ml-1">
        <!-- Solution -->
        解答
      </p>
    </button>
    <button id="reset" class="bg-bg-secondary rounded-lg p-2" @click="reset">
      <font-awesome-icon
        :icon="['fas', 'arrow-rotate-left']"
        class="text-text-primary"
      />
      <p class="text-text-primary inline ml-1">
        <!-- Reset -->
        重來
      </p>
    </button>
    <button id="continue" class="bg-bg-disabled rounded-lg p-2">
      <font-awesome-icon
        :icon="['far', 'circle-right']"
        class="text-text-disabled"
      />
      <p class="text-text-disabled inline ml-1">
        <!-- Continue -->
        繼續
      </p>
    </button>
  </section>
</template>

<script setup>
import { createSession } from '../store/session'

const reset = async () => {
  console.log('resetting...')
  await createSession()
}
</script>
