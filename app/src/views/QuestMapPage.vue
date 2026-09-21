<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import QuestMap from '../components/QuestMap.vue'
import HeaderPart from '../components/header/HeaderPart.vue'
import GameHeaderComponents from '../components/header/GameHeaderComponents.vue'

const { t } = useI18n()
</script>

<template>
  <div class="w-fit">
    <HeaderPart
      :title="t('quest_map.title')"
      :headerComponent="GameHeaderComponents"
      class="z-50"
    />
  </div>
  <div class="flex flex-col justify-center items-center w-full h-full pt-5">
    <QuestMap />
  </div>
</template>
