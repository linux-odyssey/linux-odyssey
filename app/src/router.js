import { createRouter, createWebHistory } from 'vue-router'
import GamePage from './views/GamePage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import ChooseUsernamePage from './views/ChooseUsernamePage.vue'
import QuestMapPage from './views/QuestMapPage.vue'
import LeaderboardPage from './views/LeaderboardPage.vue'
import LandingPage from './views/LandingPage.vue'
import { isLoggedIn } from './utils/auth'

const routes = [
  {
    path: '/',
    redirect: {
      name: 'landing-page',
    },
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
  {
    path: '/map',
    name: 'map',
    component: QuestMapPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardPage,
  },
  {
    path: '/landing',
    name: 'landing-page',
    component: LandingPage,
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
      // name: 'register',
      name: 'landing',
      query: { redirect: to.fullPath }, // Optionally pass a redirect parameter
    })
  } else if (to.meta.requiresGuest && loggedIn) {
    next({
      name: 'map',
    })
  } else {
    next()
  }
})

export default router
