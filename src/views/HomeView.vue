<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Hero Section -->
    <main class="container mx-auto mt-24 px-4 flex-grow">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-light tracking-wide mb-4 text-gray-800">
          <span class="font-extralight">Exploring </span>
          <span
              class="font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
      <h2 class="flex text-2xl font-light mb-2 text-gray-800 pb-2 justify-center items-center">
        Latest Insights
      </h2>

      <p class="flex text-xl font-light mb-8 text-gray-800 border-b border-gray-200 pb-2 justify-center items-center">
        <span class="text-gray-500">Explore the latest insights in technology and design.</span>
      </p>

      <!-- Category filter buttons -->
      <div class="flex justify-center items-center space-x-4 mb-8">
        <button
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none text-white bg-blue-500"
            @click="fetchBlogs()"
        >
          All
        </button>
        <button
            v-for="category in categories"
            :key="category.id"
            class="px-4 py-1 rounded-full text-sm cursor-pointer select-none text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-white"
            @click="navigateToCategory(category.name)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Loading posts...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center text-red-500 py-12">
        <p>Error loading posts: {{ error.message }}</p>
      </div>

      <!-- Blog grid -->
      <div v-else-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <!-- Calendar Icon with Date -->
              <div class="flex items-center justify-between mr-6 ">
                <svg xmlns="http://www.w3.org/2000/svg" class=" text-black h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(blog.created_at) }}</span>
              </div>

              <!-- Time Icon with Reading Time -->
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class=" text-black h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ blog.reading_time_minutes }} min read</span>
              </div>
            </div>
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
        <p>There are no posts available yet. Check back later!</p>
      </div>
    </section>

    <!-- About Section -->
    <section class="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-light mb-8 text-gray-800 border-b border-gray-200 pb-2 flex justify-center items-center">
          About</h2>
        <div class="max-w-3xl mx-auto space-y-6 text-gray-600">
          <p>
            A minimalist chronicle of insights shaped by the intersection of technology and human experience.
          </p>
          <p>
            This digital space embraces simplicity and thoughtful design, providing an unobtrusive platform for ideas to
            unfold naturally.
          </p>
          <p>
            Each entry is carefully curated within its respective category, allowing you to explore concepts that
            resonate with your intellectual curiosity.
          </p>
          <p>
            Join me on this journey of discovery, where each post serves as a stepping stone towards a deeper
            understanding of the world around us.
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
  </div>
</template>

<script setup lang="ts">
import { BlogsServices } from "@/services/BlogsServices.ts";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type {BlogsModel, category,} from "@/models/BlogsModel.ts";

// Reactive state
const router = useRouter();
const categories = ref<category[]>([]);
const blogs = ref<BlogsModel[]>([]);
const isLoading = ref(false);
const error = ref<Error | null>(null);

// Data fetching functions
const fetchCategories = async () => {
  try {
    console.log("Starting to fetch categories...");
    isLoading.value = true;
    const response = await BlogsServices.fetchAllCategories();

    console.log("Raw categories response:", response);
    categories.value = Array.isArray(response) ? response : [];
    console.log("Processed categories:", categories.value);
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
    console.log("Starting to fetch blogs...");
    isLoading.value = true;
    const response = await BlogsServices.getPublishedBlogs();
    console.log("Raw blogs response:", response);

    blogs.value = Array.isArray(response) ? response : [];
    console.log("Processed blogs:", blogs.value);

    // Log detailed blog info including category IDs
    blogs.value.forEach(blog => {
      console.log(`Blog: "${blog.title}"`, {
        id: blog.id,
        categoryId: blog.category_id,
        hasCategory: !!categories.value.find(c => c.id === blog.category_id)
      });
    });
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error("Error fetching blogs:", err);
    blogs.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadData = async () => {
  try {
    // First fetch categories, then blogs
    await fetchCategories();
    await fetchBlogs();
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err));
    console.error("Error loading data:", err);
  }
};

const navigateToCategory = (name: string) => {
  router.push(`/category/${name}`);
};

const scrollToContent = () => {
  const nextSection = document.querySelector('main')?.nextElementSibling;
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const getCategoryName = (categoryId: string | number | null | undefined): string => {
  if (!categoryId) return "Uncategorized";

  const idToFind = String(categoryId);
  const category = categories.value.find(cat => String(cat.id) === idToFind);

  if (!category) {
    console.warn(`Category not found for ID: ${categoryId}`);
    return "Uncategorized";
  }

  return category.name;
};

const getCategoryDescription = (categoryId: string | number | null | undefined): string => {
  if (!categoryId) return "None";

  const idToFind = String(categoryId);
  const category = categories.value.find(cat => String(cat.id) === idToFind);

  return category?.description || "No description available";
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
    return dateString;
  }
};

// Lifecycle hooks
onMounted(async () => {
  console.log("Component mounted, loading data...");
  await loadData();
});
</script>