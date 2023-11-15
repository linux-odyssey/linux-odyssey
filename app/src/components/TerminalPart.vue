<script setup>
import { onMounted, ref } from 'vue'
import { useTerminal } from '../store/session'

const terminal = ref(null)

onMounted(() => {
  const term = useTerminal()
  term.mount(terminal.value)
  window.addEventListener('resize', () => term.resizeScreen())
})
</script>

<template>
  <div class="h-[10%] w-full max-h-full">
    <font-awesome-icon :icon="['fas', 'terminal']" class="text-text p-1" />
    <button class="text-text h-full">Terminal</button>
  </div>
  <div id="terminal" ref="terminal" class="h-[90%] p-2"></div>
</template>
