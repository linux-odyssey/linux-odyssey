import { createApp } from 'vue'
import './style.css'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './library'
/* import Vue Toastification */
import Toast, { POSITION } from 'vue-toastification'
/* import Vue Lottie */
import Vue3Lottie from 'vue3-lottie'
import 'vue-toastification/dist/index.css'
import useI18n from './i18n'
import App from './App.vue'
import router from './router'

const app = useI18n(createApp(App))

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

const options = {
  position: POSITION.TOP_RIGHT,
}

app.use(Toast, options)

app.use(Vue3Lottie, { name: 'Vue3Lottie' })
app.mount('#app')
