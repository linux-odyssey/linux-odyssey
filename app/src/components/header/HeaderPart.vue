<script setup lang="ts">
import { defineProps, ref } from 'vue'

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
const menuOpen = ref(false)
const windowWidth = window.innerWidth < 768
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>
<template>
  <div
    class="w-full top-0 px-5 fixed flex flex-row flex-wrap bg-bg-secondary justify-between items-center sm:justify-between"
  >
    <div class="flex flex-row items-center gap-3" :class="{ hidden: menuOpen }">
      <img src="../../img/icon_totem.svg" class="h-8 justify-self-start" />
      <RouterLink
        to="/"
        id="GameTitle"
        class="text-text-primary inline-block font-bold whitespace-nowrap pt-1 transition ease-in-out hover:scale-110 duration-300"
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
    <div
      class="w-full flex flex-col items-center justify-end sm:w-auto sm:block sm:ml-6"
      :class="{ hidden: !menuOpen }"
    >
      <component :is="headerComponent" />
    </div>
    <div
      v-if="windowWidth"
      :class="{ 'w-full flex justify-end pb-3': menuOpen }"
    >
      <button
        type="button"
        class="flex items-center h-5 w-5 rounded-md sm:hidden"
        aria-controls="mobile-menu"
        aria-expanded="false"
        @click="toggleMenu"
      >
        <font-awesome-icon
          :icon="['fas', 'bars']"
          class="text-text-primary h-full w-full"
        />
      </button>
    </div>
  </div>
</template>
