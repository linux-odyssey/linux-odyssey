<script setup>
import QuestMap from '../components/QuestMap.vue'
import GameHeaderPart from '../components/GameHeaderPart.vue'
</script>

<template>
  <div class="h-[6vh] w-full">
    <GameHeaderPart />
    <p
      class="text-text-primary absolute z-1 font-bold inline-block tracking-widest"
      style="left: 1.2%; top: 1.5%; height: 100%; font-size: 2vh"
    >
      <!-- Quest Map -->
      Unix編年史
    </p>
  </div>
  <div class="flex flex-col justify-center items-center w-full h-[94vh]">
    <QuestMap />
  </div>
</template>
