<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTerminal } from '../../store/session'

const terminal = ref<HTMLElement | null>(null)

onMounted(() => {
  const term = useTerminal()
  if (!terminal.value) return
  term.mount(terminal.value)
  window.addEventListener('resize', () => term.resizeScreen())
})
</script>

<template>
  <font-awesome-icon :icon="['fas', 'terminal']" class="text-text p-1" />
  <button id="Terminal" class="text-text h-[5%]">{{ $t('terminal') }}</button>
  <div
    id="terminal"
    ref="terminal"
    class="bg-bg-secondary h-[calc(100%-5%)] p-0.5"
  ></div>
</template>
