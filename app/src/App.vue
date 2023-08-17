<script setup>
// Import components
import CommandlistPart from './components/CommandlistPart.vue'
import HeaderPart from './components/HeaderPart.vue'
import HintPart from './components/HintPart.vue'
import QuestPart from './components/QuestPart.vue'
import TerminalPart from './components/TerminalPart.vue'
import VisualizationPart from './components/VisualizationPart.vue'
import ControlPalette from './components/ControlPalette.vue'
</script>

<template>
  <div class="bg-background-primary h-screen">
    <!--header-->
    <div id="header" class="bg-background-secondary content-center h-[6%] p-1">
      <HeaderPart />
    </div>
    <!--main-->
    <div id="main" class="h-[94%] grid grid-cols-3 gap-3 p-3">
      <!--Topic and Command List-->
      <div class="bg-background-secondary inline-block h-full rounded-lg">
        <section id="quest" class="h-2/3 m-3">
          <QuestPart />
        </section>
        <hr class="border-text-line border" />
        <section id="cmdlist" class="h-1/3">
          <CommandlistPart />
        </section>
      </div>
      <!--Terminal and Hint-->
      <div class="bg-background inline-block h-full py-2 rounded-lg">
        <section id="terminal" class="h-3/5">
          <TerminalPart />
        </section>
        <section id="hint" class="h-2/5">
          <HintPart />
        </section>
      </div>
      <!--Visualization-->
      <div class="bg-background-primary inline-block h-full">
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
  </div>
</template>
<script></script>
