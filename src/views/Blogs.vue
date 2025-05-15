<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Latest Blog Posts</h1>


    <div>
      <ul class="flex space-x-4 mb-8">
        <li v-for="category in categories" :key="category.id">
          <button
              class="text-gray-600 hover:bg-blue-500 Hover:text-white px-3 py-1 rounded-full text-sm cursor-pointer select-none"
              @click="() => fetchBlogsByCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </li>
      </ul>

    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="blogs.length === 0" class="text-center py-12">
      <p class="text-gray-500">No blog posts found.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="blog in blogs"
          :key="blog.id"
          class="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="navigateToBlog(blog.slug)"
      >
        <img
            src="/cover_image.jpeg"
            alt="blog.title"
            class="w-full h-48 object-cover"
        >
        <div class="p-6">
          <div class="flex items-center text-sm text-gray-500 mb-2">
            <span>{{ formatDate(blog.published_at) }}</span>
            <span class="mx-2">•</span>
            <span>{{ blog.reading_time_minutes }} min read</span>
          </div>
          <h2 class="text-xl font-bold mb-2 line-clamp-2">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ blog.excerpt }}</p>
          <div class="flex items-center">
            <img
                src="/person.jpg"
                alt="blog.author?.full_name"
                class="w-8 h-8 rounded-full mr-2"
            >
            <span class="text-sm">{{ blog.author?.full_name || 'Unknown Author' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {BlogsServices} from "@/services/BlogsServices.ts";
import type {BlogsModel} from "@/models/BlogsModel.ts";


const router = useRouter();
const blogs = ref<BlogsModel[]>([]);
const loading = ref(true);

interface category {

  id: string;
  name: string;
  created_at: string;


}

const categories = ref<category[]>([]);
// Format date for display
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Unpublished';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
const fetchBlogsCategories = async () => {
  try {
    loading.value = true;
    const response = await BlogsServices.fetchAllCategories();
    if (response) {

      categories.value = Array.isArray(response) ? response : [response];
      console.log('Fetched blog categories:', response);
      // Handle categories if needed
    }
  } catch (error) {
    console.error('Error fetching blog categories:', error);
  } finally {
    loading.value = false;
  }
}

const fetchBlogs = async () => {
  try {
    loading.value = true;
    const response = await BlogsServices.getBlogs();


    if (response) {
      console.log('Fetched blogs:', response);
      blogs.value = Array.isArray(response) ? response : [response];
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // Optionally show error message to user
  } finally {
    loading.value = false;
  }
};

const fetchBlogsByCategory = async (category: string) => {
  try {
    loading.value = true;
    const response = await BlogsServices.fetchBlogsByCategory(category);
    if (response) {
      console.log('Fetched blogs by category:', response);
      blogs.value = Array.isArray(response) ? response : [response];
    }
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToBlog = (slug: string) => {
  router.push(`/blog-details/${slug}`);
};
onMounted(() => {
  fetchBlogs()

  fetchBlogsCategories()
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>