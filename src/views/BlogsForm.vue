<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-700">
      Create Blog
    </h1>

    <div class="mb-10 p-6 border border-gray-200 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">Blog Details</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title*</label>
          <input
              v-model="blogData.title"
              id="title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Blog title"
              required
          />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="slug">Slug*</label>
          <input
              v-model="blogData.slug"
              id="slug"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="URL-friendly-slug"
              required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="cover_image">Cover Image URL</label>
          <input
              v-model="blogData.cover_image"
              id="cover_image"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="https://example.com/image.jpg"
          />
          <div v-if="blogData.cover_image" class="mt-2">
            <img
                :src="blogData.cover_image"
                class="h-48 w-full object-cover rounded-md border"
                @error="handleImageError"
            >
          </div>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="cover_image_credit">Image Credit</label>
          <input
              v-model="blogData.cover_image_credit"
              id="cover_image_credit"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Photo by Author"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="status">Status*</label>
          <select
              v-model="blogData.is_published"
              id="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
          >
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="category">Category*</label>
          <select
              v-model="blogData.category_id"
              id="category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="excerpt">Excerpt*</label>
        <textarea
            v-model="blogData.excerpt"
            id="excerpt"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
            placeholder="Short summary..."
            required
        ></textarea>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="main_content">Main Content*</label>
        <RichTextEditor v-model="blogData.main_content" />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">Tags</label>
        <div class="flex mb-2">
          <input
              v-model="newTagName"
              @keydown.enter.prevent="addNewTag"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Add new tag"
          >
          <button
              @click="addNewTag"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r-md"
          >
            Add
          </button>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <span
              v-for="tagId in selectedTags"
              :key="`selected-${tagId}`"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {{ getTagName(tagId) }}
            <button
                @click="removeTag(tagId)"
                type="button"
                class="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900"
            >
              ×
            </button>
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <div v-for="tag in availableTags" :key="tag.id" class="flex items-center">
            <input
                :id="`tag-${tag.id}`"
                type="checkbox"
                :value="tag.id"
                v-model="selectedTags"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label :for="`tag-${tag.id}`" class="ml-2 text-sm text-gray-700">{{ tag.name }}</label>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <button
            @click="submitBlog"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md"
            :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Create Blog</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        </button>
        <button
            @click="resetForm"
            type="button"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/UseSupabase';
import { BlogsServices } from "@/services/BlogsServices";
import type { BlogsModel } from "@/models/BlogsModel";
import RichTextEditor from "@/views/RichTextEditor.vue";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const router = useRouter();

const blogData = ref<Partial<BlogsModel>>({
  title: '',
  slug: '',
  category_id: '',
  main_content: '',
  cover_image: '',
  cover_image_credit: '',
  excerpt: '',
  is_published: false,
  reading_time_minutes: 0,
});

const categories = ref<Category[]>([]);
const availableTags = ref<Tag[]>([]);
const selectedTags = ref<string[]>([]);
const newTagName = ref('');
const isSubmitting = ref(false);

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = '/cover_image.jpeg';
};

const calculateReadingTime = (text: string) => {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const generateSlug = (title: string) => {
  return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
};

const addNewTag = async () => {
  if (!newTagName.value.trim()) return;

  try {
    const trimmedName = newTagName.value.trim();
    const { data: existingTag } = await supabase
        .from('blog_tags')
        .select()
        .ilike('name', trimmedName)
        .single();

    if (existingTag) {
      if (!selectedTags.value.includes(existingTag.id)) {
        selectedTags.value.push(existingTag.id);
      }
    } else {
      const { data: newTag } = await supabase
          .from('blog_tags')
          .insert({ name: trimmedName })
          .select()
          .single();

      if (newTag) {
        availableTags.value.push(newTag);
        selectedTags.value.push(newTag.id);
      }
    }

    newTagName.value = '';
  } catch (error) {
    console.error('Error adding tag:', error);
  }
};

const getTagName = (tagId: string): string => {
  const tag = availableTags.value.find(t => t.id === tagId);
  return tag ? tag.name : 'Unknown Tag';
};

const removeTag = (tagId: string) => {
  selectedTags.value = selectedTags.value.filter(id => id !== tagId);
};

const fetchCategories = async () => {
  try {
    const { data } = await supabase
        .from('category')
        .select('id, name')
        .order('name');

    if (data) categories.value = data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchTags = async () => {
  try {
    const { data } = await supabase
        .from('blog_tags')
        .select('id, name')
        .order('name');

    if (data) availableTags.value = data;
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

const validateForm = () => {
  return blogData.value.title && blogData.value.slug && blogData.value.main_content && blogData.value.excerpt;
};

const submitBlog = async () => {
  if (!validateForm() || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    blogData.value.reading_time_minutes = calculateReadingTime(blogData.value.main_content || '');

    const { data: newBlog, error: blogError } = await supabase
        .from('blogs')
        .insert({
          ...blogData.value,
          published_at: blogData.value.is_published ? new Date().toISOString() : null
        })
        .select()
        .single();

    if (blogError) throw blogError;

    if (selectedTags.value.length > 0) {
      const tagRelations = selectedTags.value.map(tagId => ({
        blog_id: newBlog.id,
        tag_id: tagId
      }));

      await supabase
          .from('blog_tag_relations')
          .insert(tagRelations);
    }

    await router.push(`/blog/${newBlog.slug}`);
  } catch (error) {
    console.error('Blog creation failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  blogData.value = {
    title: '',
    slug: '',
    category_id: '',
    main_content: '',
    cover_image: '',
    cover_image_credit: '',
    excerpt: '',
    is_published: false,
    reading_time_minutes: 0,
  };
  selectedTags.value = [];
};

onMounted(async () => {
  await fetchCategories();
  await fetchTags();
});

watch(() => blogData.value.title, (newTitle) => {
  if (newTitle && !blogData.value.slug) {
    blogData.value.slug = generateSlug(newTitle);
  }
});
</script>