<template>
  <header class="mb-12">
    <img
        :src="blog.cover_image || '/cover_image.jpeg'"
        :alt="blog.title"
        class="w-full h-96 object-cover rounded-lg mb-6"
    >
    <div class="flex items-center mb-4">
      <img
          :src="blog.author?.avatar_url || '/person.jpg'"
          :alt="blog.author?.full_name || 'Author'"
          class="w-12 h-12 rounded-full mr-3"
      >
      <div>
        <p class="font-medium">{{ blog.author?.full_name || 'Unknown Author' }}</p>
        <p class="text-gray-500 text-sm">
          {{ formatDate(blog.published_at) }} · {{ blog.reading_time_minutes }} min read
        </p>
      </div>
    </div>
    <h1 class="text-4xl font-bold mb-2">{{ blog.title }}</h1>
    <p class="text-xl text-gray-600 mb-6">{{ blog.subtitle }}</p>
    <div class="flex items-center space-x-4">
      <button @click="$emit('toggle-like')" class="flex items-center">
        <HeartIcon :filled="isLiked" />
        <span class="ml-1">{{ blog.like_count || 0 }}</span>
      </button>
      <span class="flex items-center">
        <CommentIcon />
        <span class="ml-1">{{ blog.comment_count || 0 }}</span>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/date'
import HeartIcon from './icons/HeartIcon.vue'
import CommentIcon from './icons/CommentIcon.vue'

defineProps<{
  blog: BlogsModel
  isLiked: boolean
}>()

defineEmits<{
  (e: 'toggle-like'): void
}>()
</script>