<script setup lang="ts">
import QuestMap from '../components/QuestMap.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'
</script>

<template>
  <div class="w-fit h-[5vh]">
    <HeaderPart
      :title="關卡地圖"
      :headerComponent="GameHeaderComponents"
      class="z-50"
    />
  </div>
  <!-- <p
      class="text-text-primary absolute z-1 font-bold inline-block tracking-widest"
      style="left: 1.2%; top: 1.5%; height: 100%; font-size: 2vh"
    >
      Quest Map
      Unix編年史
    </p> -->
  <div class="flex flex-col justify-center items-center w-full h-[95vh]">
    <QuestMap />
  </div>
</template>
