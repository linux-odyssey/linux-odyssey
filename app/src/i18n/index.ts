import { createI18n } from 'vue-i18n'
import type { QuestLocale } from '../../../packages/constants'
import { SUPPORTED_LOCALES } from '../../../packages/constants'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

function isSupportedLocale(locale: string): locale is QuestLocale {
  return SUPPORTED_LOCALES.includes(locale as QuestLocale)
}

function getInitialLocale(): QuestLocale {
  const savedLocale = localStorage.getItem('locale')

  if (savedLocale && isSupportedLocale(savedLocale)) {
    return savedLocale
  }

  return navigator.language.startsWith('zh') ? 'zh-TW' : 'en'
}

const initialLocale = getInitialLocale()

document.documentElement.lang = initialLocale

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    en,
  },
})

export function setLocale(locale: QuestLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}
