<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue'
import { useTerminal } from '../store/session'

const terminal: Ref<any> = ref(null)

onMounted(() => {
  const term = useTerminal()
  term.mount(terminal.value)
  window.addEventListener('resize', () => term.resizeScreen())
})
</script>

<template>
  <font-awesome-icon :icon="['fas', 'terminal']" class="text-text p-1" />
  <button id="Terminal" class="text-text h-[5%]">終端機</button>
  <div
    id="terminal"
    ref="terminal"
    class="bg-bg-secondary h-[calc(100%-5%)] p-0.5"
  ></div>
</template>
