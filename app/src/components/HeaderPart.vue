<script setup></script>

<template>
  <div class="h-full flex items-center justify-center mx-3">
    <div class="flex items-center gap-3">
      <button id="stream" class="flex items-center">
        <font-awesome-icon
          :icon="['fas', 'bars']"
          class="text-text-primary h-5 w-5"
        />
      </button>
      <button id="backward" class="flex items-center">
        <font-awesome-icon
          :icon="['fas', 'arrow-left']"
          class="text-text-tertiary h-5 w-5"
        />
      </button>
      <button>
        <p class="text-text-primary inline-block font-bold whitespace-nowrap">
          1. Command's Basics
        </p>
      </button>
      <p class="text-text-primary inline-block font-bold">●</p>
      <button>
        <p class="text-text-primary inline-block font-bold whitespace-nowrap">
          1. Try Your First Command
        </p>
      </button>
    </div>
    <div class="h-full w-full flex gap-3 items-center justify-end">
      <button id="warning" class="flex items-center">
        <font-awesome-icon
          :icon="['fas', 'triangle-exclamation']"
          class="text-text-primary h-5 w-5"
        />
      </button>
      <button id="setting" class="flex items-center">
        <font-awesome-icon
          :icon="['fas', 'gear']"
          class="text-text-primary h-5 w-5"
        />
      </button>
      <button id="fullscreen" class="flex items-center">
        <font-awesome-icon
          :icon="['fas', 'expand']"
          class="text-text-primary h-5 w-5"
        />
      </button>
    </div>
  </div>
</template>
