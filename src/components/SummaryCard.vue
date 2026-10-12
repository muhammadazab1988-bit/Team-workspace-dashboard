<script setup>
defineProps({
  title: String,
  value: Number,
});
</script>

<template>
  <div
    class="rounded-xl bg-white p-4 shadow text-center transition: duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <p class="text-gray-500">{{ title }}</p>
    <h2 class="text-3xl font-bold">{{ value }}</h2>
  </div>
</template>
