<script setup>
defineProps({
  loading: Boolean,
  error: String,
  empty: Boolean,
  emptyText: { type: String, default: "No data found" },
});
</script>

<template>
  <p v-if="loading" class="text-center text-gray-500">Loading...</p>
  <p v-else-if="error" class="text-center text-red-600">{{ error }}</p>
  <p v-else-if="empty" class="text-center text-gray-500">{{ emptyText }}</p>
</template>
