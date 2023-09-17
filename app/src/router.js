import { createRouter, createWebHistory } from 'vue-router'
import GamePage from './views/GamePage.vue'
import AuthPage from './views/AuthPage.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   console.log(to, from)
//   const isAuthed = isAuthenticated.value
//   // Check if the route requires authentication
//   if (to.meta.requiresAuth && !isAuthed) {
//     // Check if the user isn't authenticated
//     // Redirect to the login page
//     next({
//       name: 'auth',
//       query: { redirect: to.fullPath }, // Optionally pass a redirect parameter
//     })
//   } else if (to.meta.requiresGuest && isAuthed) {
//     next({
//       name: 'game', // Or any default authenticated user route
//     })
//   } else {
//     next() // Always call next() at the end
//   }
// })

export default router
