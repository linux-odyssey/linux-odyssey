<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: false,
  },
  headerComponent: {
    type: Object,
    required: false,
  },
})
</script>
<template>
  <div
    id="header"
    class="w-full top-0 px-5 fixed flex flex-row bg-bg-secondary justify-between items-center"
  >
    <div class="flex flex-row items-center gap-3">
      <img src="../../img/icon_totem.svg" class="h-8 justify-self-start" />
      <RouterLink
        to="/"
        class="text-text-primary inline-block font-bold whitespace-nowrap pt-1"
        style="font-size: 2vh"
      >
        Linux Odyssey
      </RouterLink>
      <p
        id="QuestTitle"
        class="text-text inline-block font-bold whitespace-nowrap"
        style="font-size: 2vh"
      >
        {{ title }}
      </p>
    </div>
    <div class="w-full flex gap-3 items-center justify-end">
      <component :is="headerComponent" />
    </div>
  </div>
</template>
