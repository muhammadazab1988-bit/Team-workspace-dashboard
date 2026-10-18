<script setup>
defineProps({
  loading: Boolean,
  error: String,
  empty: Boolean,
  emptyText: { type: String, default: "No data found" },
});
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center gap-3 py-10">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"
    ></div>
    <p class="text-gray-500">Loading...</p>
  </div>
  <p v-else-if="error" class="text-center text-red-600">{{ error }}</p>
  <p v-else-if="empty" class="text-center text-gray-500">{{ emptyText }}</p>
</template>