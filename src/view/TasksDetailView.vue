<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios.js";
import StateMessage from "../components/StateMessage.vue";

const route = useRoute();
const task = ref(null);
const user = ref(null);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const taskRes = await api.get("/todos/" + route.params.id);
    task.value = taskRes.data;

    const userRes = await api.get("/users/" + task.value.userId);
    user.value = userRes.data;
  } catch (e) {
    error.value =
      e.response?.status === 404
        ? "Task not found (invalid ID)"
        : "Failed to load task";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <router-link class="text-blue-500 hover:underline" to="/tasks"
    >← Back to tasks</router-link
  >

  <StateMessage :loading="loading" :error="error" />

  <div
    v-if="task && user"
    class="flex flex-col gap-3 bg-gray-200 shadow rounded-2xl font-bold"
  >
    <h1 class="text-xl font-bold">{{ task.title }}</h1>
    <p>Status: {{ task.completed ? "Completed" : "Pending" }}</p>
    <p>Assigned to: {{ user.name }} ({{ user.email }})</p>
  </div>
</template>
