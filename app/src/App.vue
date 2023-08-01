<script setup>
// Import components
import commandlist_part from './components/commandlist-part.vue'
import header_part from './components/header-part.vue'
import hint_part from './components/hint-part.vue'
import quest_part from './components/quest-part.vue'
import terminal_part from './components/terminal-part.vue'
import visualization_part from './components/visualization-part.vue'
</script>

<template>
  <div class="bg-background-primary h-screen">
    <!--header-->
    <div id="header" class="bg-background-secondary content-center h-[6%] p-1">
      <header_part />
    </div>
    <!--main-->
    <div id="main" class="h-[94%] grid grid-cols-3 gap-3 p-3">
      <!--Topic and Command List-->
      <div class="bg-background-secondary inline-block h-full rounded-lg">
        <section id="quest" class="h-2/3 m-3">
          <quest_part />
        </section>
        <hr class="border-text-line border" />
        <section id="cmdlist" class="h-1/3">
          <commandlist_part />
        </section>
      </div>
      <!--Terminal and Hint-->
      <div class="bg-background inline-block h-full py-2 rounded-lg">
        <section id="terminal" class="h-3/5">
          <terminal_part />
        </section>
        <section id="hint" class="h-2/5">
          <hint_part />
        </section>
      </div>
      <!--Visualization-->
      <div class="bg-background-primary inline-block h-full">
        <div class="bg-border rounded-xl h-[90%] px-3 py-6">
          <div class="bg-background rounded-xl h-full px-1 py-6">
            <section id="visualization" class="bg-background-primary h-full">
              <visualization_part />
            </section>
          </div>
        </div>
        <section
          class="h-[10%] p-3 grid grid-cols-3 gap-4 place-content-between"
        >
          <button id="solution" class="bg-background-secondary rounded-lg p-2">
            <font-awesome-icon
              :icon="['far', 'circle-question']"
              class="text-text-primary"
            />
            <p class="text-text-primary inline">Solution</p>
          </button>
          <button id="reset" class="bg-background-secondary rounded-lg p-2">
            <font-awesome-icon
              :icon="['fas', 'arrow-rotate-left']"
              class="text-text-primary"
            />
            <p class="text-text-primary inline">Reset</p>
          </button>
          <button id="continue" class="bg-disabled-background rounded-lg p-2">
            <font-awesome-icon
              :icon="['far', 'circle-right']"
              class="text-disabled-text"
            />
            <p class="text-disabled-text inline">Continue</p>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>
