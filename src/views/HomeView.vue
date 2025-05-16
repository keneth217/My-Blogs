<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="backdrop-blur-sm bg-white/70 shadow-sm fixed w-full z-10">
      <div class="container mx-auto flex justify-around items-start p-4">
        <div class="font-light text-xl text-gray-700">
          <span
              class="font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-serif">
            Rooted in Curiosity
          </span>
        </div>

        <nav>
          <ul class="flex space-x-6">
            <li>
              <router-link to="/" class="text-gray-600 hover:text-indigo-500 transition-colors duration-300">
                Home
              </router-link>
            </li>
            <li v-for="category in categories" :key="category.id">
              <p
                  @click="fetchBlogsByCategory(category.id)"
                  :class="{
      'text-gray-600 hover:text-indigo-500 transition-colors duration-300 cursor-pointer': true,
      'font-medium text-indigo-500': currentCategoryId === category.id
    }"
              >
                {{ category.name }}
              </p>
            </li>

          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="container mx-auto mt-24 px-4 flex-grow">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-light tracking-wide mb-4 text-gray-800">
          <span class="font-extralight">Exploring </span>
          <span class="font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Tomorrow's Ideas
      </span>
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          A collection of thoughts on technology, design, and the future of our digital landscape.
        </p>
        <p class="mt-10">Debugging life, one story at a time.</p>

        <!-- Animated Down Arrow -->
        <div class="mt-16 animate-bounce rounded-full border-2 border-gray-300 p-2 w-12 h-12 mx-auto">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mx-auto text-gray-600 cursor-pointer hover:text-black transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="scrollToContent"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </main>

    <!-- Blog Section -->
    <section class="container mx-auto px-4 py-12 max-w-5xl">
      <h2 class=" flex text-2xl font-light mb-2 text-gray-800  pb-2  justify-center items-center">
        {{ currentCategoryId ? getCategoryName(currentCategoryId) : 'Latest Insights' }}
      </h2>

      <p class="flex text-xl font-light mb-8 text-gray-800 border-b border-gray-200 pb-2  justify-center items-center">
        <span class="text-gray-500">Explore the latest insights in technology and design.</span>

      </p>

      <!-- Category filter buttons -->
      <div class="flex justify-center items-center space-x-4 mb-8">
        <button
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none"
            :class="{
            'text-white bg-blue-500': !currentCategoryId,
            'text-gray-600 bg-gray-200 hover:bg-gray-700 hover:text-white': currentCategoryId
          }"
            @click="fetchBlogs()"
        >
          All
        </button>
        <button
            v-for="category in categories"
            :key="category.id"
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none"
            :class="{
            'text-white bg-blue-500': currentCategoryId === category.id,
            'text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white': currentCategoryId !== category.id
          }"
            @click="fetchBlogsByCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Blog grid -->
      <div v-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <div
            v-for="blog in filteredBlogs"
            :key="blog.id"
            class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img
                v-if="blog.cover_image"
                :src="blog.cover_image"
                :alt="blog.title"
                class="w-full h-full object-cover"
            >
            <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100"
            >
              <span class="text-gray-400">No image</span>
            </div>
          </div>
          <div class="p-6">
            <span class="text-xs text-indigo-500 uppercase tracking-wider">
              {{ getCategoryName(blog.categoryId) }}
            </span>
            <h3 class="text-xl font-medium mt-2 mb-3 text-gray-800">{{ blog.title }}</h3>
            <p class="text-gray-600 text-sm line-clamp-3">{{ blog.excerpt }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-xs text-gray-500">{{ formatDate(blog.created_at) }}</span>
              <router-link
                  :to="`/all-published-blogs/${blog.slug}`"
                  class="text-indigo-500 text-sm hover:text-indigo-600 transition-colors duration-300"
              >
                Read more →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-12">
        <h1>No blogs found.</h1>

        <p>  There are no posts in this category yet. Check back later!</p>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-light mb-8 text-gray-800 border-b border-gray-200 pb-2 flex justify-center items-center">About</h2>
        <div class="max-w-3xl mx-auto space-y-6 text-gray-600  ">
          <p>
            A minimalist chronicle of insights shaped by the intersection of technology and human experience.
          </p>
          <p>
            This digital space embraces simplicity and thoughtful design, providing an unobtrusive platform for ideas to
            unfold naturally.
          </p>
          <p>
            Each entry is carefully curated within its respective category, allowing you to explore concepts that
            resonate
            with your intellectual curiosity.
          </p>
          <p>
            Join me on this journey of discovery, where each post serves as a stepping stone towards a deeper
            understanding
            of the world around us.
          </p>
          <p>
            Your thoughts and reflections are always welcome, as they enrich the dialogue and foster a sense of
            community.
          </p>
        </div>
       <div class="flex justify-center items-start font-bold mt-10 font-italic">
         <p>Debugging life, one story at a time.</p>
       </div>
      </div>
    </section>

    <footer class="bg-gray-900 text-gray-400 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-around items-center">
          <div class="mb-4 md:mb-0">
            <span class="font-light tracking-wider">
              © 2025 <span class="text-white font-medium">KENETH</span>. All rights reserved.
            </span>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-white transition-colors duration-300">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" class="hover:text-white transition-colors duration-300">
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
import {onMounted, ref, computed, watch} from "vue";
import {useRoute} from "vue-router";
import type {BlogsModel, category} from "@/models/BlogsModel.ts";

// Reactive state
const route = useRoute();
const categories = ref<category[]>([]);
const blogs = ref<BlogsModel[]>([]);
const currentCategoryId = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<Error | null>(null);

// Data fetching functions
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

const fetchBlogs = async () => {
  try {
    isLoading.value = true;
    const response = await BlogsServices.getPublishedBlogs();
    blogs.value = Array.isArray(response) ? response : [];
    currentCategoryId.value = null; // Reset category filter when fetching all blogs
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error("Error fetching blogs:", err);
    blogs.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchBlogsByCategory = async (categoryId: string) => {
  try {
    isLoading.value = true;
    const response = await BlogsServices.fetchPublishedBlogsByCategory(categoryId);
    blogs.value = Array.isArray(response) ? response : [];
    currentCategoryId.value = categoryId;
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error("Error fetching blogs by category:", err);
    blogs.value = [];
  } finally {
    isLoading.value = false;
  }
};

const scrollToContent = () => {
  const nextSection = document.querySelector('main').nextElementSibling;
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Helper functions
const getCategoryName = (categoryId: string | null): string => {
  if (!categoryId) return "All";
  const category = categories.value.find(cat => cat.id === categoryId);
  return category?.name ?? "Uncategorized";
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString; // Return original string if date parsing fails
  }
};

// Computed properties
const filteredBlogs = computed(() => {
  if (!currentCategoryId.value) return blogs.value;
  return blogs.value.filter(blog => blog.categoryId === currentCategoryId.value);
});

// Watchers
watch(
    () => route.params.id,
    (newId) => {
      const id = newId ? String(newId) : null;
      if (id) {
        fetchBlogsByCategory(id);
      } else {
        fetchBlogs();
      }
    },
    {immediate: true}
);

// Lifecycle hooks
onMounted(async () => {
  await fetchCategories();
  // Don't call fetchBlogs here since the watcher will handle initial load
});

// Expose any needed functions or values to template
defineExpose({
  getCategoryName,
  formatDate
});
</script>

<style>
/* Additional global styles for the futuristic theme */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap');

html {
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
}

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
</style>