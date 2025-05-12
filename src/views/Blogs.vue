<script setup>
import {ref, onMounted} from 'vue'
import {supabase} from "@/services/UseSupabase.js";
import {BlogsServices} from "@/services/BlogsServices.js";

const instruments = ref([])

const getInstruments = async () => {

  try {
    const response = await BlogsServices.getBlogs()
    instruments.value = response
    console.log("Blogs data in app vue:", response)
  } catch (error) {
    console.error("Error fetching blogs:", error)

  }
}

onMounted(() => {
  getInstruments()
})
</script>

<template>
  <ul>
    <li v-for="instrument in instruments" :key="instrument.id">
      {{ instrument.content }}
    </li>
  </ul>
</template>