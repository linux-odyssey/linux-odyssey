<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useTerminal } from '../../store/session'

const terminal = ref<HTMLElement | null>(null)
const term = useTerminal()

onMounted(() => {
  if (!terminal.value) return
  term.mount(terminal.value)

  const handleResize = () => term.resizeScreen()
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-2 p-1">
      <font-awesome-icon :icon="['fas', 'terminal']" class="text-text" />
      <button id="Terminal" class="text-text">終端機</button>
    </div>
    <div
      id="terminal"
      ref="terminal"
      class="bg-bg-secondary flex-grow overflow-hidden px-2"
      style="height: calc(100vh - 40px)"
    ></div>
  </div>
</template>
