<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
  icons: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desciption: String,
})
</script>
<template>
  <div class="flex flex-col">
    <a :href="url" target="_blank" class="h-10 w-10" :title="desciption">
      <font-awesome-icon
        :icon="icons"
        :alt="title"
        class="text-text-primary h-10 delay-130 hover:-translate-y-1 hover:scale-110"
      />
    </a>
  </div>
</template>
