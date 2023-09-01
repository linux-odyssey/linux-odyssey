<script setup>
import { onMounted } from 'vue'
import CommandlistPart from './components/CommandlistPart.vue'
import HeaderPart from './components/HeaderPart.vue'
import HintPart from './components/HintPart.vue'
import QuestPart from './components/QuestPart.vue'
import TerminalPart from './components/TerminalPart.vue'
import VisualizationPart from './components/VisualizationPart.vue'
import ControlPalette from './components/ControlPalette.vue'
import socket from './utils/socket'
import sessionManager from './utils/session'

onMounted(async () => {
  await sessionManager.lastOrCreate()
  socket.connect(sessionManager.getSession())
  socket.on('connect', function open() {
    console.log('Connected to the server.')
  })
  socket.on('disconnect', function close() {
    console.log('Disconnected from the server.')
  })
  socket.on('message', console.log)
  socket.on('graph', (event) => {
    sessionManager.handleGraphUpdate(event)
  })
  socket.on('tasks', (tasks) => {
    sessionManager.setTasks(tasks)
  })
})
</script>

<template>
  <div class="bg-background-primary h-screen">
    <!--header-->
    <div id="header" class="bg-background-secondary content-center h-[6vh] p-1">
      <HeaderPart />
    </div>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import HeaderPart from './components/HeaderPart.vue'
</script>

<script setup>
import HeaderPart from './components/HeaderPart.vue'
</script>
