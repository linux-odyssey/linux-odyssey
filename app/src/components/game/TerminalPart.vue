<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useSession, useTerminal } from '../../store/session'

const sessionStore = useSession()

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

      <a
        class="text-sm font-normal text-gray-200 ml-10"
        :href="`/terminal/${sessionStore.session?.containerName}?token=${sessionStore.session?.token}`"
        target="_blank"
      >
        Open Terminal in New Tab
      </a>
    </div>
    <div
      id="terminal"
      ref="terminal"
      class="bg-bg-secondary flex-grow overflow-hidden px-2"
      style="height: calc(100vh - 40px)"
    ></div>
  </div>
</template>
