<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios.js";
import StateMessage from "../components/StateMessage.vue";

const route = useRoute();
const post = ref(null);
const author = ref(null);
const comments = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const id = route.params.id;

    const postRes = await api.get("/posts/" + id);
    post.value = postRes.data;

    const [authorRes, commentsRes] = await Promise.all([
      api.get("/users/" + post.value.userId),
      api.get("/posts/" + id + "/comments"),
    ]);
    author.value = authorRes.data;
    comments.value = commentsRes.data;
  } catch (e) {
    error.value =
      e.response?.status === 404
        ? "Discussion not found (invalid ID)"
        : "Failed to load discussion";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <router-link class="text-blue-500 hover:underline" to="/team">← Back to team</router-link>

  <StateMessage :loading="loading" :error="error" />

  <div v-if="post && author" class="flex flex-col gap-3 bg-gray-200 shadow rounded-2xl font-bold">
    <h1 class="text-xl font-bold">{{ post.title }}</h1>
    <p>{{ post.body }}</p>
    <p>By {{ author.name }} (@{{ author.username }}) · {{ author.email }}</p>

    <h2 class="text-lg font-semibold text-red-500" >Comments ({{ comments.length }})</h2>
    <StateMessage :empty="comments.length === 0" emptyText="No comments yet" />

    <div v-for="c in comments" :key="c.id">
      <h4>{{ c.name }}</h4>
      <p>{{ c.email }}</p>
      <p>{{ c.body }}</p>
    </div>
  </div>
</template>
