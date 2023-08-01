<script setup></script>

<template>
  <font-awesome-icon :icon="['fas', 'terminal']" class="text-text p-1" />
  <button class="text-text h-[5%]">Terminal</button>
  <div class="bg-background-secondary h-[calc(100%-5%)] p-4">
    <p class="text-text-primary">
      zeko@first-command<span class="text-text">:~$</span>
    </p>
  </div>
</template>
