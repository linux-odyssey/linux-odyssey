<template>
  <div class="flex flex-col justify-center items-center">
    <div class="p-3 bg-slate-700 w-screen flex">
      <h1 class="text-teal-300 text-4xl font-mono font-black skew-y-3">
        Quest Map
      </h1>
      <p>Quest Map Page</p>
    </div>
    <QuestMap />
  </div>
</template>

<script setup>
import QuestMap from '../components/QuestMap.vue'
</script>
