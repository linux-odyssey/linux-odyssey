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
let showMenu = false
const ToggleMenu = () => {
  console.log(showMenu)
  showMenu = true
  console.log(showMenu)
}
const hideMenu = () => {
  showMenu = false
}
const handleItemClick = (item) => {
  console.log('Clicked:', item)
  // Add your logic for handling item click here
}
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
    <div class="w-full flex gap-3 items-center justify-end hidden sm:flex">
      <component :is="headerComponent" />
    </div>
    <button class="flex items-center justify-end sm:hidden h-5 w-5">
      <font-awesome-icon
        :icon="['fas', 'bars']"
        class="text-text-primary h-full w-full"
        @click="ToggleMenu"
      />
    </button>
  </div>
  <div v-if="showMenu" class="bg-bg-primary w-full h-1/2 z-50">
    <!-- Menu items -->
    <ul>
      <li
        v-for="item in menuItems"
        :key="item.id"
        @click="handleItemClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
