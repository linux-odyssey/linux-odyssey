<script setup></script>

<template>
  <div class="inline-block">
    <button id="stream" class="p-1">
      <font-awesome-icon
        :icon="['fas', 'bars-staggered']"
        class="text-text-primary"
      />
    </button>
    <button id="backward" class="p-1">
      <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-border" />
    </button>
    <button>
      <p class="text-text-primary inline font-bold p-1">1. Command's Basics</p>
    </button>
    <p class="text-text-primary inline font-bold p-1">‧</p>
    <button>
      <p class="text-text-primary inline font-bold p-1">
        1. Try Your First Command
      </p>
    </button>
  </div>
  <div class="float-right inline-block">
    <button id="warning" class="p-1">
      <font-awesome-icon
        :icon="['fas', 'triangle-exclamation']"
        class="text-text-primary"
      />
    </button>
    <button id="setting" class="p-1">
      <font-awesome-icon :icon="['fas', 'gear']" class="text-text-primary" />
    </button>
    <button id="fullscreen" class="p-1">
      <font-awesome-icon :icon="['fas', 'expand']" class="text-text-primary" />
    </button>
  </div>
</template>
