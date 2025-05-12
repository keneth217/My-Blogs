import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',

      component: () => import('../views/Login.vue'),
    },

    {
      path: '/profile',
      name: 'profile',

      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/register',
      name: 'register',

      component: () => import('../views/Reigister.vue'),
    },
  ],
})

export default router
