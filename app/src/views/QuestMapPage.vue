<script setup lang="ts">
import QuestMap from '../components/QuestMap.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'
</script>

<template>
  <div class="h-[6vh] w-full">
    <HeaderPart :title="關卡地圖" :headerComponent="GameHeaderComponents" />
  </div>
  <div class="flex flex-col justify-center items-center w-full h-[94vh]">
    <QuestMap />
  </div>
</template>
