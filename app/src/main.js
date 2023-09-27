import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faBars,
  faArrowLeft,
  faList,
  faGear,
  faTriangleExclamation,
  faExpand,
  faTerminal,
  faArrowRotateLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'

import {
  faLightbulb,
  faCircleQuestion,
  faCircleRight,
} from '@fortawesome/free-regular-svg-icons'

import App from './App.vue'
import GamePage from './views/GamePage.vue'
import AuthPage from './views/AuthPage.vue'

/* add icons to the library */
library.add(
  faBars,
  faArrowLeft,
  faTriangleExclamation,
  faGear,
  faExpand,
  faList,
  faLightbulb,
  faCircleQuestion,
  faArrowRotateLeft,
  faCircleRight,
  faTerminal,
  faArrowRight
)

const routes = [
  { path: '/', name: 'Home', component: AuthPage },
  { path: '/game', name: 'Game', component: GamePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
