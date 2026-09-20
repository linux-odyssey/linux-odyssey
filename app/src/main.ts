import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // import font awesome icon component
import { i18n } from './i18n'
import Toast, { POSITION } from 'vue-toastification' // import Vue Toastification
import Vue3Lottie from 'vue3-lottie' // import Vue Lottie
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import formbricks from './utils/formbricks'
import './style.css'
import './library'

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.use(i18n)

router.afterEach(() => {
  if (typeof formbricks !== 'undefined') {
    formbricks.registerRouteChange()
  }
})

const options = {
  position: POSITION.TOP_RIGHT,
}

app.use(Toast, options)

app.use(Vue3Lottie, { name: 'Vue3Lottie' })

app.mount('#app')
