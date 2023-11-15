import { createApp } from 'vue'
import './style.css'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './library'
/* import Vue Toastification */
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

const options = {
  position: POSITION.TOP_RIGHT,
}

app.use(Toast, options)

app.mount('#app')
