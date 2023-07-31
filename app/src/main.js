import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faBarsStaggered,
  faArrowLeft,
  faList,
  faGear,
  faTriangleExclamation,
  faExpand,
  faTerminal,
  faArrowRotateLeft,
} from '@fortawesome/free-solid-svg-icons'

import {
  faLightbulb,
  faCircleQuestion,
  faCircleRight,
} from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(
  faBarsStaggered,
  faArrowLeft,
  faTriangleExclamation,
  faGear,
  faExpand,
  faList,
  faLightbulb,
  faCircleQuestion,
  faArrowRotateLeft,
  faCircleRight,
  faTerminal
)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
