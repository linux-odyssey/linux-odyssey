import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import { App } from 'vue'
import en from './translations/en.json'
import zh from './translations/zh.json'

i18next.init({
  debug: true,
  fallbackLng: 'zh',
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
})

export default function useI18n(app: App) {
  app.use(I18NextVue, { i18next })
  return app
}

export { i18next }
