<script setup lang="ts">
import QuestMap from '../components/QuestMap.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'
</script>

<template>
  <div class="w-fit">
    <HeaderPart
      title="關卡地圖"
      :headerComponent="GameHeaderComponents"
      class="z-50"
    />
  </div>
  <div class="flex flex-col justify-center items-center w-full h-full pt-5">
    <QuestMap />
  </div>
</template>
