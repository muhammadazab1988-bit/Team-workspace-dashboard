<script setup>
import { useRoute } from "vue-router";
import NavBar from "./components/Navbare.vue";

const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <NavBar v-if="route.meta.private" />
    <main class="mx-auto max-w-5xl p-5">
      <router-view />
    </main>
  </div>
</template>
