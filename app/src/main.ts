import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './library'
/* import Vue Toastification */
import Toast, { POSITION } from 'vue-toastification'
/* import Vue Lottie */
import Vue3Lottie from 'vue3-lottie'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import formbricks from './utils/formbricks'

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)

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
