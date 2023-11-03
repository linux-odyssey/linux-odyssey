<script setup>
import { computed, onMounted } from 'vue'
import sessionManager from '../utils/session'
import GameHeaderPart from '../components/GameHeaderPart.vue'
import CommandlistPart from '../components/CommandlistPart.vue'
import HintPart from '../components/HintPart.vue'
import QuestPart from '../components/QuestPart.vue'
import TerminalPart from '../components/TerminalPart.vue'
import VisualizationPart from '../components/VisualizationPart.vue'
import ControlPalette from '../components/ControlPalette.vue'
import CompleteModal from '../components/CompleteModal.vue'

const completed = computed(() => {
  return sessionManager.status.value === 'finished'
})

onMounted(async () => {
  await sessionManager.init()
})
</script>

<template>
  <!-- game header -->
  <div class="h-[6vh] w-full">
    <GameHeaderPart />
  </div>
  <!-- current status indicator -->
  <input
    type="hidden"
    id="currentStatus"
    :value="sessionManager.status.value"
  />
  <!-- main -->
  <div id="main" class="h-[94vh] w-full flex p-3 space-x-3">
    <!-- Topic and Command List -->
    <div class="bg-bg-secondary h-full w-1/3 rounded-lg">
      <section id="quest" class="h-2/3 p-3">
        <QuestPart />
      </section>
      <hr class="border-text-tertiary border" />
      <section id="cmdlist" class="h-1/3">
        <CommandlistPart />
      </section>
    </div>
    <!-- Terminal and Hint -->
    <div class="bg-bg h-full w-1/3 rounded-lg">
      <section id="terminal" class="h-3/5">
        <TerminalPart />
      </section>
      <section id="hint" class="h-2/5">
        <HintPart />
      </section>
    </div>
    <!-- Visualization -->
    <div class="h-full w-1/3">
      <div class="bg-border rounded-xl h-[90%] p-2">
        <div class="bg-bg rounded-lg h-full p-2">
          <section id="visualization" class="bg-bg-primary h-full rounded-md">
            <VisualizationPart />
          </section>
        </div>
      </div>
      <ControlPalette />
    </div>
    <CompleteModal v-if="completed" />
  </div>
</template>
<script></script>
