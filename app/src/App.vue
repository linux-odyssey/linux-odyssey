<template>
  <div class="bg-background-primary h-screen">
    <!--header-->
    <div id="header" class="bg-background-secondary content-center h-[6vh] p-1">
      <HeaderPart />
    </div>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import HeaderPart from './components/HeaderPart.vue'
</script>

<script setup>
import HeaderPart from './components/HeaderPart.vue'
</script>
