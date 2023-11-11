import { createRouter, createWebHistory } from 'vue-router'
import GamePage from './views/GamePage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import ChooseUsernamePage from './views/ChooseUsernamePage.vue'
import { isLoggedIn } from './utils/auth'

const routes = [
  {
    path: '/',
    redirect: '/game',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/game/:questId',
    name: 'game',
    component: GamePage,
    props: true,
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
      name: 'register',
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
