<template>
  <div class="h-[6vh] w-full">
    <GameHeaderPart />
  </div>
  <div class="flex flex-col justify-center items-center h-[94vh]">
    <QuestMap />
    <!-- <div id="header" class="p-2 bg-slate-700 w-screen flex h-[6vh]">
      <h1 class="text-teal-300 text-4xl font-mono font-black skew-y-3">
        Quest Map
      </h1> -->
    <!-- <p>Quest Map Page</p> -->
  </div>
  <!-- </div> -->
</template>

<script setup>
import QuestMap from '../components/QuestMap.vue'
import GameHeaderPart from '../components/GameHeaderPart.vue'
</script>
