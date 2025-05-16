<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-center text-indigo-700">
      {{ blogData.id ? 'Edit Blog' : 'Create Blog' }}
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
            <option value="false">false</option>
            <option value="true">true</option>

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
        <div v-if="blogData.status === 'scheduled'" class="md:col-span-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="scheduled_at">Schedule Date/Time</label>
          <input
              v-model="blogData.scheduled_at"
              id="scheduled_at"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="datetime-local"
          />
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
        <textarea
            v-model="blogData.main_content"
            id="main_content"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-64"
            placeholder="Write your content here..."
            required
        ></textarea>
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

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Subtitle Sections</h3>
        <div
            v-for="(subtitle, index) in blogData.blog_subtitles"
            :key="index"
            class="mb-6 p-4 border rounded-lg bg-gray-50"
        >
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-medium">Section {{ index + 1 }}</h4>
            <button
                @click="removeSubtitle(index)"
                type="button"
                class="text-red-600 hover:text-red-800 text-sm"
                :disabled="blogData.blog_subtitles.length <= 1"
            >
              Remove
            </button>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" :for="`subtitle-${index}`">Subtitle*</label>
            <input
                v-model="subtitle.subtitle"
                :id="`subtitle-${index}`"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                required
            />
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" :for="`subcontent-${index}`">Content*</label>
            <textarea
                v-model="subtitle.content"
                :id="`subcontent-${index}`"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                required
            ></textarea>
          </div>
        </div>
        <button
            @click="addSubtitle"
            type="button"
            class="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md text-sm"
        >
          + Add Section
        </button>
      </div>

      <div class="flex justify-between">
        <button
            @click="submitBlog"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md"
            :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Save Changes</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
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
import {ref, onMounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/services/UseSupabase';
import { BlogsServices } from "@/services/BlogsServices";
import type { BlogsModel } from "@/models/BlogsModel";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Subtitle {
  id?: string;
  subtitle: string;
  content: string;
  order_index: number;
}

const route = useRoute();
const router = useRouter();

const blogData = ref<BlogsModel>({
  id: '',
  title: '',
  slug: '',
  category_id: '',
  main_content: '',
  cover_image: '',
  cover_image_credit: '',
  status: 'draft',
  excerpt: '',
  author_id: '',
  is_published: false,
  published_at: null,
  scheduled_at: null,
  reading_time_minutes: 0,
  blog_subtitles: [],
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

const addSubtitle = () => {
  blogData.value.blog_subtitles.push({
    subtitle: '',
    content: '',
    order_index: blogData.value.blog_subtitles.length
  });
};

const removeSubtitle = (index: number) => {
  if (blogData.value.blog_subtitles.length > 1) {
    blogData.value.blog_subtitles.splice(index, 1);
    // Update order indices
    blogData.value.blog_subtitles.forEach((sub, idx) => {
      sub.order_index = idx;
    });
  }
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

const fetchBlog = async () => {
  try {
    const blogId = route.params.id as string;
    if (!blogId) return;

    const blog = await BlogsServices.getBlogById(blogId);
    if (!blog) {
      router.push('/404');
      return;
    }

    blogData.value = {
      ...blog,
      category_id: blog.category_id || ''
    };

    // Fetch subtitles
    const { data: subtitles } = await supabase
        .from('blog_subtitles')
        .select()
        .eq('blog_id', blogId)
        .order('order_index');

    if (subtitles) {
      blogData.value.blog_subtitles = subtitles;
    }

    // Fetch tags
    const { data: tagRelations } = await supabase
        .from('blog_tag_relations')
        .select('tag_id')
        .eq('blog_id', blogId);

    if (tagRelations) {
      selectedTags.value = tagRelations.map(tr => tr.tag_id);
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    router.push('/404');
  }
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
  if (!blogData.value.title || !blogData.value.slug || !blogData.value.main_content || !blogData.value.excerpt) {
    return false;
  }
  return blogData.value.blog_subtitles.every(sub => sub.subtitle && sub.content);
};

const submitBlog = async () => {
  if (!validateForm() || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    // Calculate reading time
    let allContent = blogData.value.main_content;
    blogData.value.blog_subtitles.forEach(sub => {
      allContent += ` ${sub.subtitle} ${sub.content}`;
    });
    blogData.value.reading_time_minutes = calculateReadingTime(allContent);

    // Set publication dates
    if (blogData.value.status === 'published') {
      blogData.value.published_at = new Date().toISOString();
      blogData.value.is_published = true;
    } else if (blogData.value.status === 'scheduled') {
      blogData.value.is_published = false;
    } else {
      blogData.value.is_published = false;
      blogData.value.published_at = null;
      blogData.value.scheduled_at = null;
    }

    const currentDate = new Date().toISOString();
    blogData.value.updated_at = currentDate;

    // Update blog
    const { data: updatedBlog, error: blogError } = await supabase
        .from('blogs')
        .update({
          title: blogData.value.title,
          slug: blogData.value.slug,
          main_content: blogData.value.main_content,
          cover_image: blogData.value.cover_image,
          cover_image_credit: blogData.value.cover_image_credit,
          status: blogData.value.status,
          category_id: blogData.value.category_id,
          excerpt: blogData.value.excerpt,
          published_at: blogData.value.published_at,
          scheduled_at: blogData.value.scheduled_at,
          reading_time_minutes: blogData.value.reading_time_minutes,
          updated_at: blogData.value.updated_at
        })
        .eq('id', blogData.value.id)
        .select()
        .single();

    if (blogError) throw blogError;

    // Update subtitles
    await supabase
        .from('blog_subtitles')
        .delete()
        .eq('blog_id', blogData.value.id);

    const subtitlesToInsert = blogData.value.blog_subtitles.map((sub, index) => ({
      blog_id: blogData.value.id,
      subtitle: sub.subtitle,
      content: sub.content,
      order_index: index
    }));

    await supabase
        .from('blog_subtitles')
        .insert(subtitlesToInsert);

    // Update tags
    await supabase
        .from('blog_tag_relations')
        .delete()
        .eq('blog_id', blogData.value.id);

    if (selectedTags.value.length > 0) {
      const tagRelations = selectedTags.value.map(tagId => ({
        blog_id: blogData.value.id,
        tag_id: tagId
      }));

      await supabase
          .from('blog_tag_relations')
          .insert(tagRelations);
    }

    router.push(`/blog/${blogData.value.slug}`);
  } catch (error) {
    console.error('Blog update failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  if (blogData.value.id) {
    fetchBlog(); // Reset to original values
  } else {
    blogData.value = {
      id: '',
      title: '',
      slug: '',
      category_id: '',
      main_content: '',
      cover_image: '',
      cover_image_credit: '',
      status: 'draft',
      excerpt: '',
      author_id: blogData.value.author_id,
      is_published: false,
      published_at: null,
      scheduled_at: null,
      reading_time_minutes: 0,
      blog_subtitles: []
    };
    selectedTags.value = [];
    addSubtitle();
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchTags();

  const blogId = route.params.id;
  if (blogId) {
    await fetchBlog();
  } else {
    addSubtitle();
  }
});

watch(() => blogData.value.title, (newTitle) => {
  if (newTitle && !blogData.value.slug) {
    blogData.value.slug = generateSlug(newTitle);
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>