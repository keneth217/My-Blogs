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
      path: '/category/:name',
      name: 'Blog Category',
      component: () => import('../views/CategoryPage.vue'),
      meta: { requiresAuth: false }
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children:[

        {
          path: '',
          name: 'Dashboard Stats',
          component: () => import('../views/DashboardStarts.vue'),

        },
        {
          path: 'blogs',
          name: 'Blogs',
          component: () => import('../views/Blogs.vue'),

        },
        {
          path: 'edit-blog/:id',
          name: 'Edit Blog',
          component: () => import('@/views/EditBlog.vue'),
          props: true
        },
        {
          path: 'new-blog',
          name: 'New Blog',
          component: () => import('../views/BlogsForm.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'blog-details/:slug',
          name: 'BlogDetails',
          component: () => import('@/views/BlogDetails.vue'),
          props: true
        },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false, redirectIfAuthenticated: true }
    },
    {
      path: '/published-blogs',
      name: 'Published Blogs',
      component: () => import('../views/PublishedBlogs.vue'),
    },

    {
      path: '/all-published-blogs/:slug',
      name: 'all-Published Blogs',
      component: () => import('../views/PublishedBlogsDetails.vue'),

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
      next('/dashboard')
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