<script setup>
import { onMounted, ref } from 'vue'
import socket from '../utils/socket'
import sessionManager from '../utils/session'
import GameHeaderPart from '../components/GameHeaderPart.vue'
import CommandlistPart from '../components/CommandlistPart.vue'
import HintPart from '../components/HintPart.vue'
import QuestPart from '../components/QuestPart.vue'
import TerminalPart from '../components/TerminalPart.vue'
import VisualizationPart from '../components/VisualizationPart.vue'
import ControlPalette from '../components/ControlPalette.vue'
import CompleteModal from '../components/CompleteModal.vue'

const completed = ref(false)

onMounted(async () => {
  await sessionManager.lastOrCreate()
  socket.connect(sessionManager.getSession())
  socket.on('connect', function open() {
    console.log('Connected to the server.')
  })
  socket.on('disconnect', function close() {
    console.log('Disconnected from the server.')
  })
  socket.on('graph', (event) => {
    sessionManager.handleGraphUpdate(event)
  })
  socket.on('hints', (event) => {
    sessionManager.handleHintUpdate(event)
  })
  socket.on('tasks', (tasks) => {
    sessionManager.setTasks(tasks)
  })
  socket.on('message', console.log)
  socket.on('status', (event) => {
    console.log('status', event)
    if (event === 'finished') {
      setTimeout(() => {
        completed.value = true
      }, 5000)
    }
  })
})
</script>

<template>
  <!-- game header -->
  <div class="h-[5vh] w-full">
    <GameHeaderPart />
  </div>
  <!-- main -->
  <div id="main" class="h-[95vh] w-full flex p-3 space-x-3">
    <!-- Topic and Command List -->
    <div class="bg-background-secondary h-full w-1/3 rounded-lg">
      <section id="quest" class="h-2/3 p-3">
        <QuestPart />
      </section>
      <hr class="border-text-tertiary border" />
      <section id="cmdlist" class="h-1/3">
        <CommandlistPart />
      </section>
    </div>
    <!-- Terminal and Hint -->
    <div class="bg-background h-full w-1/3 rounded-lg">
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
        <div class="bg-background rounded-lg h-full p-2">
          <section
            id="visualization"
            class="bg-background-primary h-full rounded-md"
          >
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
