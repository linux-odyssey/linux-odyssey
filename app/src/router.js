import { createRouter, createWebHistory } from 'vue-router'
import GamePage from './views/GamePage.vue'
import AuthPage from './views/AuthPage.vue'
import ChooseUsernamePage from './views/ChooseUsernamePage.vue'
import { isLoggedIn } from './utils/auth'

const routes = [
  {
    path: '/',
    redirect: '/game',
  },
  {
    path: '/login',
    name: 'auth',
    component: AuthPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/choose-username',
    name: 'choose-username',
    component: ChooseUsernamePage,
    meta: { requiresGuest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const loggedIn = await isLoggedIn()
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !loggedIn) {
    // Check if the user isn't authenticated
    // Redirect to the login page
    next({
      name: 'auth',
      query: { redirect: to.fullPath }, // Optionally pass a redirect parameter
    })
  } else if (to.meta.requiresGuest && loggedIn) {
    next({
      name: 'game', // Or any default authenticated user route
    })
  } else {
    next() // Always call next() at the end
  }
})

export default router
