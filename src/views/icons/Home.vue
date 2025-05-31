<template>
  <Analytics/>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="backdrop-blur-sm bg-white/70 shadow-sm fixed w-full ">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-around items-center">
          <!-- Logo -->
          <div class="font-light text-xl text-gray-700">
            <router-link to="/"
                         class="font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-serif">
              Rooted in Curiosity
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:block">
            <ul class="flex space-x-6">
              <li>
                <router-link
                    to="/"
                    class="relative text-gray-600 hover:text-indigo-500 transition-colors duration-300"
                    :class="{ 'text-indigo-500': $route.path === '/' }"
                >
                  Home
                  <span
                      v-if="$route.path === '/'"
                      class="absolute left-0 -bottom-2 w-full h-0.5 bg-indigo-500 transition-all duration-300"
                  ></span>
                </router-link>
              </li>
              <li v-for="category in categories" :key="category.id">
                <router-link
                    :to="`/category/${category.name}`"
                    class="relative text-gray-600 hover:text-indigo-500 transition-colors duration-300"
                    :class="{ 'text-indigo-500': isActiveCategory(category.name) }"
                >
                  {{ category.name }}
                  <span
                      v-if="isActiveCategory(category.name)"
                      class="absolute left-0 -bottom-2 w-full h-0.5 bg-indigo-500 transition-all duration-300"
                  ></span>
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- Mobile menu button -->
          <button
              @click="isMenuOpen = !isMenuOpen"
              class="md:hidden flex items-center p-2 rounded-md text-gray-600 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <svg
                v-if="!isMenuOpen"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg
                v-else
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMenuOpen" class="md:hidden bg-white/95 shadow-lg">
          <div class="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <router-link
                to="/"
                class="block px-3 py-2 rounded-md text-base font-medium"
                :class="{
                  'text-indigo-500 bg-indigo-50': $route.path === '/',
                  'text-gray-700 hover:text-indigo-500 hover:bg-gray-50': $route.path !== '/'
                }"
                @click="isMenuOpen = false"
            >
              <span class="relative">
                Home
                <span
                    v-if="$route.path === '/'"
                    class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-500"
                ></span>
              </span>
            </router-link>

            <router-link
                v-for="category in categories"
                :key="category.id"
                :to="`/category/${category.name}`"
                class="block px-3 py-2 rounded-md text-base font-medium"
                :class="{
                  'text-indigo-500 bg-indigo-50': isActiveCategory(category.name),
                  'text-gray-700 hover:text-indigo-500 hover:bg-gray-50': !isActiveCategory(category.name)
                }"
                @click="isMenuOpen = false"
            >
              <span class="relative">
                {{ category.name }}
                <span
                    v-if="isActiveCategory(category.name)"
                    class="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-500"
                ></span>
              </span>
            </router-link>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main content with padding to account for fixed header -->


    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <span class="font-light tracking-wider">
              &copy; {{ new Date().getFullYear() }}
              <a href="https://www.kipyegonkeneth.co.ke/" target="_blank"
                 class="text-white font-medium hover:text-indigo-400 transition-colors duration-300">
                Keneth Kipyegon
              </a>. All rights reserved.
            </span>
          </div>

          <div class="mb-4 md:mb-0">
            <a href="https://www.kipyegonkeneth.co.ke/"
               class="text-gray-300 hover:text-indigo-400 transition-colors duration-300 text-sm"
               target="_blank">
              Portfolio.me
            </a>
          </div>

          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-white transition-colors duration-300">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition-colors duration-300">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {BlogsServices} from "@/services/BlogsServices.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import type {Category} from "@/models/BlogsModel.ts";
import {Analytics} from '@vercel/analytics/vue';


// Reactive state
const route = useRoute();
const categories = ref<Category[]>([]);
const isLoading = ref(false);
const error = ref<Error | null>(null);
const isMenuOpen = ref(false);

// Helper functions
const isActiveCategory = (name: string): boolean => {
  return route.path.includes(`/category/${name}`);
};

// Data fetching
const fetchCategories = async () => {
  try {
    isLoading.value = true;
    const response = await BlogsServices.fetchAllCategories();
    categories.value = Array.isArray(response) ? response : [];
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error("Error fetching categories:", err);
    categories.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Close menu when route changes
const closeMenu = () => {
  isMenuOpen.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  await fetchCategories();
});
</script>

<style>


.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* Smooth transitions for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>