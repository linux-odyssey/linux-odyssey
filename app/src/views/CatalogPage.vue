<template>
  <div class="h-[6vh] w-full">
    <GameHeaderPart />
  </div>
  <div class="p-4 h-[94vh] w-full">
    <div class="bg-bg-secondary h-full w-full grid grid-cols-3 gap-4 p-4">
      <CatalogPart v-for="i in 9" :key="i" />
    </div>
  </div>
</template>
<script setup>
import GameHeaderPart from '../components/GameHeaderPart.vue'
import CatalogPart from '../components/CatalogPart.vue'
</script>
