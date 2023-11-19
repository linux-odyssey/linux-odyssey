<template>
  <div class="h-[6vh] w-full">
    <GameHeaderPart />
    <p
      class="text-text-primary absolute z-1 left-[3vh] top-[1vh] h-fit font-bold inline-block"
    >
      Quest Map
    </p>
  </div>
  <div class="flex flex-col justify-center items-center w-full h-[94vh]">
    <QuestMap />
  </div>
</template>

<script setup>
import QuestMap from '../components/QuestMap.vue'
import GameHeaderPart from '../components/GameHeaderPart.vue'
</script>
