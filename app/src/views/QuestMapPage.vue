<script setup lang="ts">
import QuestMap from '../components/QuestMap.vue'
import GameHeaderPart from '../components/GameHeaderPart.vue'
</script>

<template>
  <div class="h-[6vh] w-full">
    <GameHeaderPart title="關卡地圖" />
  </div>
  <div class="flex flex-col justify-center items-center w-full h-[94vh]">
    <QuestMap />
  </div>
</template>
