<script setup>
import { onMounted } from 'vue'
import socket from '../utils/socket'
import sessionManager from '../utils/session'
import CommandlistPart from '../components/CommandlistPart.vue'
import HintPart from '../components/HintPart.vue'
import QuestPart from '../components/QuestPart.vue'
import TerminalPart from '../components/TerminalPart.vue'
import VisualizationPart from '../components/VisualizationPart.vue'
import ControlPalette from '../components/ControlPalette.vue'

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
  socket.on('tasks', (tasks) => {
    sessionManager.setTasks(tasks)
  })
  socket.on('message', console.log)
})
</script>

<template>
  <!--main-->
  <div id="main" class="h-[94vh] grid grid-cols-3 gap-3 p-3">
    <!--Topic and Command List-->
    <div class="bg-background-secondary h-full rounded-lg">
      <section id="quest" class="h-2/3 m-3">
        <QuestPart />
      </section>
      <hr class="border-text-tertiary border" />
      <section id="cmdlist" class="h-1/3">
        <CommandlistPart />
      </section>
    </div>
    <!--Terminal and Hint-->
    <div class="bg-background h-full rounded-lg">
      <section id="terminal" class="h-3/5">
        <TerminalPart />
      </section>
      <section id="hint" class="h-2/5">
        <HintPart />
      </section>
    </div>
    <!--Visualization-->
    <div class="h-full">
      <div class="bg-border rounded-xl h-[90%] px-3 py-6">
        <div class="bg-background rounded-xl h-full px-1 py-6">
          <section id="visualization" class="bg-background-primary h-full">
            <VisualizationPart />
          </section>
        </div>
      </div>
      <ControlPalette />
    </div>
  </div>
</template>
<script></script>