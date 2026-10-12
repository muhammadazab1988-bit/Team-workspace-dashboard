<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";
import StateMessage from "../components/StateMessage.vue";

const todos = ref([]);
const users = ref([]);
const filter = ref("all");
const search = ref("");
const visibleCount = ref(20);
const loading = ref(true);
const error = ref("");

function getUserName(userId) {
  const user = users.value.find((usr) => usr.id === userId);
  return user ? user.name : "Unknown";
}

function setFilter(value) {
  filter.value = value;
  visibleCount.value = 20;
}

const filteredTodos = computed(() =>
  todos.value.filter((tods) => {
    if (filter.value === "completed" && !tods.completed) return false;
    if (filter.value === "pending" && tods.completed) return false;
    return tods.title.toLowerCase().includes(search.value.toLowerCase());
  }),
);

const visibleTodos = computed(() =>
  filteredTodos.value.slice(0, visibleCount.value),
);

onMounted(async () => {
  try {
    const [todosRes, usersRes] = await Promise.all([
      api.get("/todos"),
      api.get("/users"),
    ]);
    todos.value = todosRes.data;
    users.value = usersRes.data;
  } catch (err) {
    error.value = "Failed to load tasks";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1 class="text-2xl font-bold">Tasks</h1>

  <button
    @click="setFilter('all')"
    class="mr-2 rounded px-3 py-2 text-white"
    :class="filter === 'all' ? 'bg-gray-900' : 'bg-green-600'"
  >
    All
  </button>
  <button
    @click="setFilter('completed')"
    class="mr-2 rounded px-3 py-2 text-white"
    :class="filter === 'completed' ? 'bg-gray-900' : 'bg-green-600'"
  >
    Completed
  </button>
  <button
    @click="setFilter('pending')"
    class="mr-2 rounded px-3 py-2 text-white"
    :class="filter === 'pending' ? 'bg-gray-900' : 'bg-green-600'"
  >
    Pending
  </button>

  <input
    class="my-3 w-full max-w-xs rounded-xl border-2 border-gray-300 px-3 py-2"
    v-model="search"
    placeholder="Search task titles..."
    @input="visibleCount = 20"
  />

  <StateMessage
    :loading="loading"
    :error="error"
    :empty="!loading && !error && filteredTodos.length === 0"
    emptyText="No tasks found"
  />

  <div
    v-for="t in visibleTodos"
    :key="t.id"
    class="my-2 rounded-lg bg-white p-4 shadow font-bold transform transition hover:scale-105"
  >
    <router-link :to="'/tasks/' + t.id">{{ t.title }}</router-link>
    <p>Assigned to: {{ getUserName(t.userId) }}</p>
    <span
      class="rounded-full px-3 py-1 text-sm"
      :class="t.completed ? 'bg-green-200' : 'bg-yellow-200'"
    >
      {{ t.completed ? "Completed" : "Pending" }}
    </span>
  </div>

  <button
    v-if="visibleCount < filteredTodos.length"
    @click="visibleCount += 20"
  >
    Load More
  </button>
</template>
