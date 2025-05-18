<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Latest Blog Posts</h1>

    <div>
      <ul class="flex justify-center items-center space-x-4 mb-8">
        <li>
          <button
              class="px-4 py-1 rounded-full text-sm cursor-pointer select-none"
              :class="{
              'text-white bg-blue-500': selectedCategoryId === 'all',
              'text-gray-600 bg-gray-200 hover:bg-blue-500 hover:text-white': selectedCategoryId !== 'all'
            }"
              @click="() => {
              fetchPublishedBlogs();
              selectedCategoryId = 'all';
            }"
          >
            All
          </button>
        </li>
        <li v-for="category in categories" :key="category.id">
          <button
              class="px-4 py-1 rounded-full text-sm cursor-pointer select-none"
              :class="{
              'text-white bg-blue-500': selectedCategoryId === category.id,
              'text-gray-600 bg-gray-200 hover:bg-blue-500 hover:text-white': selectedCategoryId !== category.id
            }"
              @click="() => {
              fetchBlogsByCategory(category.id);
              selectedCategoryId = category.id;
            }"
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
        <!-- Image container with loading state -->
        <div class="w-full h-48 bg-gray-100 relative overflow-hidden">
          <div
              v-if="imageLoadingStates[blog.id]"
              class="absolute inset-0 animate-pulse bg-gray-200"
          ></div>
          <img
              :src="getBlogImage(blog)"
              :alt="blog.title"
              class="w-full h-full object-cover"
              @load="handleImageLoad(blog.id)"
              @error="handleImageError(blog.id)"
              v-show="!imageLoadingStates[blog.id]"
          >
        </div>

        <div class="p-6">
          <div class="flex justify-around items-center text-sm text-gray-500 mb-2">
            <span>{{ formatDate(blog.published_at) }}</span>
            <span class="mx-2">•</span>
            <span>{{ blog.reading_time_minutes }} min read</span>
          </div>
          <h2 class="text-xl font-bold mb-2 line-clamp-2">{{ blog.title }}</h2>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ blog.excerpt }}</p>
          <div class="flex items-center">
            <img
                :src="blog.author?.avatar_url || '/person.jpg'"
                :alt="blog.author?.full_name || 'Author'"
                class="w-8 h-8 rounded-full mr-2"
                @error="handleAuthorImageError"
            >
            <span class="text-sm">{{ blog.author?.full_name || 'Unknown Author' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BlogsServices } from "@/services/BlogsServices.ts";
import type { BlogsModel } from "@/models/BlogsModel.ts";

interface Category {
  id: string;
  name: string;
  created_at: string;
}

const router = useRouter();
const blogs = ref<BlogsModel[]>([]);
const loading = ref(true);
const categories = ref<Category[]>([]);
const selectedCategoryId = ref<string>('all');
const imageLoadingStates = ref<Record<string, boolean>>({});

// Initialize loading states for all blogs
const initializeImageLoadingStates = () => {
  blogs.value.forEach(blog => {
    imageLoadingStates.value[blog.id] = true;
  });
};

const getBlogImage = (blog: BlogsModel) => {

  return blog.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&w=800';
};

const handleImageLoad = (blogId: string) => {
  imageLoadingStates.value[blogId] = false;
};

const handleImageError = (blogId: string) => {

  imageLoadingStates.value[blogId] = false;
};

const handleAuthorImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/person.jpg';
};

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
    }
  } catch (error) {
    console.error('Error fetching blog categories:', error);
  } finally {
    loading.value = false;
  }
};

const fetchPublishedBlogs = async () => {
  try {
    loading.value = true;
    const response = await BlogsServices.getPublishedBlogs();
    if (response) {
      blogs.value = Array.isArray(response) ? response : [response];
      initializeImageLoadingStates();
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
  } finally {
    loading.value = false;
  }
};

const fetchBlogsByCategory = async (categoryId: string) => {
  try {
    loading.value = true;
    const response = await BlogsServices.fetchPublishedBlogsByCategory(categoryId);
    if (response) {
      blogs.value = Array.isArray(response) ? response : [response];
      initializeImageLoadingStates();
    }
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToBlog = (slug: string) => {
  router.push(`/all-published-blogs/${slug}`);
};

onMounted(() => {
  fetchPublishedBlogs();
  fetchBlogsCategories();
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