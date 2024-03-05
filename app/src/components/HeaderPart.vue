<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: false,
  },
  headerComponent: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <div
    id="header"
    class="w-full h-[6vh] px-5 flex flex-row items-center justify-between bg-bg-secondary"
  >
    <div class="flex flex-row items-center gap-3">
      <img src="../img/icon_totem.svg" class="h-8 justify-self-start" />
      <button
        id="GameTitle"
        class="text-text-primary inline-block font-bold whitespace-nowrap pt-1"
        style="font-size: 2vh"
      >
        Linux Odyssey
      </button>
      <p
        id="QuestTitle"
        class="text-text inline-block font-bold whitespace-nowrap"
        style="font-size: 2vh"
      >
        {{ title }}
      </p>
    </div>
    <div class="h-full w-full flex gap-3 items-center justify-end">
      <component :is="headerComponent" />
    </div>
  </div>
</template>
