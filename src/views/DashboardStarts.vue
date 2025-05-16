<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from "@/services/UseSupabase.ts";

interface DashboardStats {
  totalBlogs: number
  publishedBlogs: number
  draftBlogs: number
  totalUsers: number
  activeUsers: number
}

const stats = ref<DashboardStats>({
  totalBlogs: 0,
  publishedBlogs: 0,
  draftBlogs: 0,
  totalUsers: 0,
  activeUsers: 0
})

const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchStats = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Get total blogs count
    const { count: totalBlogs, error: blogsError } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })

    if (blogsError) throw blogsError

    // Get published blogs count
    const { count: publishedBlogs, error: publishedError } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', 'true')

    if (publishedError) throw publishedError

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get active users count
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers, error: activeUsersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_login', thirtyDaysAgo.toISOString())

    if (activeUsersError) throw activeUsersError

    // Update stats
    stats.value = {
      totalBlogs: totalBlogs || 0,
      publishedBlogs: publishedBlogs || 0,
      draftBlogs: (totalBlogs || 0) - (publishedBlogs || 0),
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0
    }

  } catch (err) {
    console.error('Error fetching stats:', err)
    error.value = 'Failed to load dashboard data. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-64">
      <div class="w-10 h-10 bg-indigo-100 rounded-full animate-pulse"></div>
      <p class="mt-4 text-gray-500">Loading dashboard data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-64">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
          @click="fetchStats"
          class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Dashboard content -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Blogs Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start">
            <div class="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Blogs</h3>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalBlogs }}</p>
            </div>
          </div>
        </div>

        <!-- Published Blogs Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.publishedBlogs }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ Math.round((stats.publishedBlogs / stats.totalBlogs) * 100) || 0 }}% of total
              </p>
            </div>
          </div>
        </div>

        <!-- Drafts Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start">
            <div class="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</h3>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.draftBlogs }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ Math.round((stats.draftBlogs / stats.totalBlogs) * 100) || 0 }}% of total
              </p>
            </div>
          </div>
        </div>

        <!-- Users Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start">
            <div class="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Users</h3>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ stats.activeUsers }} active in last 30 days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {{ new Date().toLocaleTimeString() }}
        </p>
        <button
            @click="fetchStats"
            class="mt-2 sm:mt-0 px-4 py-2 inline-flex items-center text-sm font-medium rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 4v6h-6" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 20v-6h6" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>