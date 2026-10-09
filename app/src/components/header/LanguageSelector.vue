<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'
import type { QuestLocale } from '../../../../packages/constants'
import {
  SUPPORTED_LOCALES,
  LOCALE_NAME_MAP,
} from '../../../../packages/constants'

const { t, locale } = useI18n({ useScope: 'global' })

function changeLanguage(event: Event) {
  const selectedLocale = (event.target as HTMLSelectElement)
    .value as QuestLocale

  setLocale(selectedLocale)
}
</script>

<template>
  <select
    :value="locale"
    :title="t('language.change')"
    class="bg-bg-secondary px-3 py-2 text-sm text-text shadow-md outline-none"
    aria-label="Language"
    @change="changeLanguage"
    style="font-size: 2vh"
  >
    <option v-for="locale in SUPPORTED_LOCALES" :key="locale" :value="locale">
      {{ LOCALE_NAME_MAP[locale] }}
    </option>
  </select>
</template>
