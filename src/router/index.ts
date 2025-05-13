import { createRouter, createWebHistory } from 'vue-router'
import { AuthService } from '@/services/AuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false, redirectIfAuthenticated: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Reigister.vue'),
      meta: { requiresAuth: false, redirectIfAuthenticated: true }
    },
    // Redirect to home by default
    {
      path: '/',
      redirect: '/home'
    }
  ]
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const redirectIfAuthenticated = to.matched.some(record => record.meta.redirectIfAuthenticated)

  try {
    // Check authentication status
    const { session, error } = await AuthService.getSession()
    const isAuthenticated = !error && session !== null

    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if trying to access protected route without auth
      next('/login')
    } else if (redirectIfAuthenticated && isAuthenticated) {
      // Redirect to profile if trying to access login/register while authenticated
      next('/profile')
    } else {
      // Proceed to the route
      next()
    }
  } catch (error) {
    console.error('Router navigation error:', error)
    // Redirect to login if there's an error checking auth status
    next('/login')
  }
})

export default router