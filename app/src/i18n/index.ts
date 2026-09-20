import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

export const supportedLocales = ['zh-TW', 'en'] as const

export type SupportedLocale = (typeof supportedLocales)[number]

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

function getInitialLocale(): SupportedLocale {
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

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}
