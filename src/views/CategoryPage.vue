<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Category Blog Section -->
    <section class="container mx-auto px-4 py-12 max-w-5xl mt-24">
      <h2 class="flex text-2xl font-light mb-2 text-gray-800 pb-2 justify-center items-center">
        {{ categoryName }}
      </h2>

      <p class="flex text-lg font-light mb-8 text-gray-800 border-b border-gray-200 pb-2 justify-center items-center">
        <span class="text-gray-500">{{categoryDescription}}</span>
      </p>

      <!-- Category filter buttons -->
      <div class="flex justify-center items-center space-x-4 mb-8">
        <router-link
            to="/"
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white"
        >
          All
        </router-link>
        <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.name}`"
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none"
            :class="{
              'text-white bg-blue-500': currentCategoryId === category.id,
              'text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white': currentCategoryId !== category.id
            }"
        >
          {{ category.name }}
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Loading posts...</p>
      </div>

      <div v-else>
        <!-- Blog grid -->
        <div v-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
              v-for="blog in blogs"
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
             name: {{ getCategoryName(blog.category_id) }}
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
          <h1>No blogs found in this category.</h1>
          <p>There are no posts in this category yet. Check back later!</p>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import {BlogsServices} from "@/services/BlogsServices.ts";
import {onMounted, ref, computed, watch} from "vue";
import {useRoute} from "vue-router";
import type {BlogsModel, Category} from "@/models/BlogsModel.ts";

const debug = ref(true);
const route = useRoute();
const categories = ref<Category[]>([]);
const blogs = ref<BlogsModel[]>([]);
const currentCategoryId = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<Error | null>(null);

// Computed properties
const categoryName = computed(() => {
  const category = categories.value.find(cat => cat.id === currentCategoryId.value);
  return category?.name ?? "All Categories";
});

const categoryDescription = computed(() => {
  const category = categories.value.find(cat => cat.id === currentCategoryId.value);
  return category?.description ?? "Ex plore all Categories";
});

// Data fetching functions
const fetchCategories = async () => {
  try {
    if (debug.value) console.group('[API] Fetching categories');
    isLoading.value = true;

    const response = await BlogsServices.fetchAllCategories();
    if (debug.value) console.log('Categories response:', response);

    categories.value = Array.isArray(response) ? response : [];
    if (debug.value) {
      console.log('Loaded categories:', categories.value);
      console.groupEnd();
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
    error.value = err instanceof Error ? err : new Error(String(err));
    categories.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchBlogsByCategory = async (categoryId: string | null) => {
  try {
    if (debug.value) console.group(`[API] Fetching blogs for category ${categoryId}`);
    isLoading.value = true;

    // Reset current category
    currentCategoryId.value = categoryId;

    // Fetch based on whether we have a category ID
    const response = categoryId
        ? await BlogsServices.fetchPublishedBlogsByCategory(categoryId)
        : await BlogsServices.getPublishedBlogs();

    if (debug.value) console.log('Blogs response:', response);

    blogs.value = Array.isArray(response) ? response : [];

    if (debug.value) {
      console.log(`Found ${blogs.value.length} blogs`);
      if (blogs.value.length > 0) {
        console.log('Blog category IDs:', blogs.value.map(b => b.category_id));
      }
      console.groupEnd();
    }
  } catch (err) {
    console.error('Error fetching blogs:', err);
    error.value = err instanceof Error ? err : new Error(String(err));
    blogs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Helper functions
const getCategoryName = (categoryId: string | null): string => {
  if (!categoryId) return "Uncategorized";
  const category = categories.value.find(cat => cat.id === categoryId);
  return category?.name ?? "Uncategorized";
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Watchers
watch(
    () => route.params.name,
    async (newName) => {
      if (debug.value) console.log('Route slug changed to:', newName);

      if (!newName) {
        // If no slug, show all blogs
        await fetchBlogsByCategory(null);
        return;
      }

      // Find the matching category
      const category = categories.value.find(c => c.name === newName);
      if (!category) {
        console.warn(`Category not found for slug: ${newName}`);
        return;
      }

      // Fetch blogs for this specific category
      await fetchBlogsByCategory(category.id);
    },
    {immediate: true}
);

// Lifecycle hooks
onMounted(async () => {
  await fetchCategories();

  // Initial load based on route
  if (route.params.name) {
    const category = categories.value.find(c => c.name === route.params.name);
    if (category) {
      await fetchBlogsByCategory(category.id);
    }
  } else {
    await fetchBlogsByCategory(null);
  }
});
</script>