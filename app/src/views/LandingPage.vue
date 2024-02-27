<script setup>
// import { computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import GameHeaderPart from '../components/GameHeaderPart.vue'
import DynamicBackground from '../components/DynamicBackground.vue'

const toast = useToast()
</script>
<template>
  <!-- game header -->
  <div class="h-[6vh] w-full">
    <GameHeaderPart :title="sessionStore.quest?.title" />
  </div>
  <div class="w-screen h-screen">
    <DynamicBackground class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    ></div>
  </div>
</template>
