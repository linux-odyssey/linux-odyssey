<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportedLocale } from '../../i18n'

const { locale } = useI18n({ useScope: 'global' })

function changeLanguage(event: Event) {
  const selectedLocale = (event.target as HTMLSelectElement)
    .value as SupportedLocale

  setLocale(selectedLocale)
}
</script>

<template>
  <select
    :value="locale"
    class="bg-bg-secondary px-3 py-2 text-sm text-text shadow-md outline-none"
    aria-label="Language"
    @change="changeLanguage"
    style="font-size: 2vh"
  >
    <option value="en">English</option>
    <option value="zh-TW">繁體中文</option>
  </select>
</template>
