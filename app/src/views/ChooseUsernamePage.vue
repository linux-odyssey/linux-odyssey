<script setup>
import UsernameForm from '../components/UsernameForm.vue'
import Background from '../components/DynamicBackground.vue'
</script>
<template>
  <div class="relative w-screen h-screen">
    <Background class="w-full h-full" />
    <div
      class="h-screen w-screen absolute top-0 left-0 flex flex-wrap justify-center content-center"
    >
      <div class="h-2/3 w-1/3">
        <UsernameForm />
      </div>
    </div>
  </div>
</template>
