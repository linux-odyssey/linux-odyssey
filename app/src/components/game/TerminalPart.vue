<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref } from 'vue'
import { useSession, useTerminal } from '../../store/session'

const { t } = useI18n()

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
      <p id="Terminal" class="text-text">{{ t('game.terminal') }}</p>

      <a
        class="text-xs font-normal text-gray-200 ml-10 bg-bg-primary rounded-lg px-2 py-1 hover:bg-bg-primary-hover transition-colors duration-300"
        :href="`/terminal/${sessionStore.session?.containerName}?token=${sessionStore.session?.token}`"
        target="_blank"
      >
        {{ t('game.open_terminal_in_new_tab') }}
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
