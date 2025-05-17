<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      class="text-color-icon"
  >
    <!-- Text character with color underline -->
    <path d="M5 4h14v3h-2V6H7v1h5v10h2V7h3v2h2V4H5zm0 14h2v2H5v-2z"/>
    <!-- Color palette indicator -->
    <path
        d="M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
        class="color-indicator"
        :style="{ fill: currentColor }"
    />
  </svg>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#000000'
  }
})

const currentColor = ref(props.color)

watch(() => props.color, (newColor) => {
  currentColor.value = newColor
})
</script>

<style scoped>
.text-color-icon {
  transition: all 0.2s ease;
}

.text-color-icon:hover {
  transform: scale(1.1);
}

.color-indicator {
  transform: translate(12px, 12px);
  stroke: var(--border-color, #e2e8f0);
  stroke-width: 1;
}
</style>