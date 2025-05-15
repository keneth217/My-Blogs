<template>
  <div v-if="loading" class="max-w-4xl mx-auto py-8 px-4">
    <div class="animate-pulse">
      <div class="w-full h-96 bg-gray-200 rounded-lg mb-6"></div>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full bg-gray-200 mr-3"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div class="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div class="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
    </div>
  </div>

  <div v-else-if="blog" class="max-w-4xl mx-auto py-8 px-4 relative">
    <!-- Fixed like/comment counts on the side -->
    <div
        class="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-center space-y-4 bg-white p-2 rounded-lg shadow-lg">
      <button
          @click="toggleLike"
          class="flex flex-col items-center group"
          :class="{ 'text-red-500': isLiked }"
      >
        <div class="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
          <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              :stroke-width="isLiked ? 1.5 : 2"
              :fill="isLiked ? 'currentColor' : 'none'"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
        <span class="text-sm font-medium mt-1">{{ blog.like_count || 0 }}</span>
      </button>

      <div class="flex flex-col items-center">
        <div class="p-2 rounded-full">
          <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <span class="text-sm font-medium mt-1">{{ blog.comment_count || 0 }}</span>
      </div>
    </div>

    <!-- Blog Content -->
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
    </header>

    <article class="prose max-w-none mb-12">
      <div v-html="blog.main_content"></div>

      <div v-for="sub in blog.subtitles || []" :key="sub.id" class="mt-12">
        <h2 class="text-2xl font-bold mb-4">{{ sub.subtitle }}</h2>
        <div v-html="sub.content"></div>
      </div>
    </article>

    <section class="border-t pt-8">
      <h3 class="text-xl font-bold mb-6">Comments ({{ blog.comment_count || 0 }})</h3>

      <!-- Comment form (shown to all users) -->
      <div class="mb-8">
        <textarea
            v-model="newComment"
            placeholder="Add a comment..."
            class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
        ></textarea>
        <button
            @click="addComment"
            class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="!newComment.trim()"
        >
          Post Comment
        </button>
      </div>

      <div v-for="comment in nestedComments" :key="comment.id" class="mb-6">
        <div class="flex items-start space-x-3">
          <img
              :src="comment.user?.avatar_url || '/person.jpg'"
              class="w-10 h-10 rounded-full mt-1"
          >
          <div class="flex-1">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium">{{ comment.user?.name || 'Anonymous' }}</p>
              <p class="text-gray-700 mt-1">{{ comment.content }}</p>
            </div>
            <button
                @click="handleReply(comment)"
                class="text-sm text-blue-600 mt-2 ml-4 hover:text-blue-800"
            >
              Reply
            </button>

            <div v-if="comment.replies?.length" class="mt-4 pl-6 border-l-2 border-gray-100">
              <div v-for="reply in comment.replies" :key="reply.id" class="mb-4">
                <div class="flex items-start space-x-3">
                  <img
                      :src="reply.user?.avatar_url || '/person.jpg'"
                      class="w-8 h-8 rounded-full mt-1"
                  >
                  <div class="flex-1">
                    <div class="bg-gray-50 p-3 rounded-lg">
                      <p class="font-medium text-sm">{{ reply.user?.name || 'Anonymous' }}</p>
                      <p class="text-gray-700 mt-1 text-sm">{{ reply.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="max-w-4xl mx-auto py-8 px-4 text-center">
    <p class="text-xl">Blog post not found</p>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {BlogsServices} from '@/services/BlogsServices'
import {AuthService} from '@/services/AuthService'
import type {BlogsModel, BlogComment} from "@/models/BlogsModel"

const route = useRoute()
const router = useRouter()

const blog = ref<BlogsModel | null>(null)
const user = ref<any>(null)
const newComment = ref('')
const isLiked = ref(false)
const loading = ref(true)

const fetchBlog = async () => {
  try {
    loading.value = true
    const response = await BlogsServices.getBlogBySlug(route.params.slug as string)
console.log(response)
    if (!response) {
      await router.push('/404')
      return
    }

    blog.value = response
    await checkUserLike()
  } catch (error) {
    console.error('Error loading blog:', error)
    await router.push('/404')
  } finally {
    loading.value = false
  }
}

const checkUserLike = async () => {
  try {
    const session = await AuthService.getSession()
    if (session.session?.user) {
      user.value = session.session.user
      const response = await BlogsServices.checkUserLike({
        blog_id: blog.value?.id || '',
        user_id: session.session.user.id
      })
      isLiked.value = !!response
    }
  } catch (error) {
    console.error('Error checking like:', error)
  }
}

const toggleLike = async () => {
  try {
    const session = await AuthService.getSession()
    if (!session.session?.user) {
      // Optionally redirect to login or show a message
      return
    }

    if (isLiked.value) {
      await BlogsServices.unlikeBlog({
        blog_id: blog.value?.id || '',
        user_id: session.session.user.id
      })
      if (blog.value) blog.value.like_count = Math.max(0, (blog.value.like_count || 0) - 1)
    } else {
      await BlogsServices.likeBlog({
        blog_id: blog.value?.id || '',
        user_id: session.session.user.id
      })
      if (blog.value) blog.value.like_count = (blog.value.like_count || 0) + 1
    }
    isLiked.value = !isLiked.value
  } catch (error) {
    console.error('Like action failed:', error)
  }
}

const addComment = async () => {
  if (!newComment.value.trim() || !blog.value) return

  try {
    const session = await AuthService.getSession()
    if (!session.session?.user) {
      // Optionally redirect to login or show a message
      return
    }

    const response = await BlogsServices.addComment({
      blog_id: blog.value.id,
      user_id: session.session.user.id,
      content: newComment.value
    })

    blog.value.comments = [...blog.value.comments || [], response]
    blog.value.comment_count = (blog.value.comment_count || 0) + 1
    newComment.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}

const handleReply = (comment: BlogComment) => {
  newComment.value = `@${comment.user?.name || 'user'} `
}

const nestedComments = computed(() => {
  if (!blog.value?.comments) return []

  const commentsMap = new Map<string, BlogComment & { replies: BlogComment[] }>()
  blog.value.comments.forEach(comment => {
    commentsMap.set(comment.id, {...comment, replies: []})
  })

  blog.value.comments.forEach(comment => {
    if (comment.parent_id) {
      commentsMap.get(comment.parent_id)?.replies.push(comment)
    }
  })

  return Array.from(commentsMap.values()).filter(comment => !comment.parent_id)
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(fetchBlog)
</script>

<style scoped>
/* Add any custom styles here */
</style>