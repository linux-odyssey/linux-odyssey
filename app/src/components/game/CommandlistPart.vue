<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <font-awesome-icon :icon="['fas', 'list']" class="text-text-primary p-1" />
  <h1 id="CommandBook" class="inline text-text-primary font-xl">
    {{ t('game.command_book') }}
  </h1>
  <div id="cheatsheets">
    <p class="text-text-secondary">-- --{{ t('game.cheatsheets') }}-- --</p>
  </div>
</template>
