<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";
import SummaryCard from "../components/SummaryCard.vue";
import StateMessage from "../components/StateMessage.vue";

const users = ref([]);
const todos = ref([]);
const loading = ref(true);
const error = ref("");

const completedCount = computed(
  () => todos.value.filter((t) => t.completed).length,
);
const pendingCount = computed(() => todos.value.length - completedCount.value);
const recentTodos = computed(() => todos.value.slice(-5).reverse());

onMounted(async () => {
  try {
    const [usersRes, todosRes] = await Promise.all([
      api.get("/users"),
      api.get("/todos"),
    ]);
    users.value = usersRes.data;
    todos.value = todosRes.data;
  } catch (e) {
    error.value = "Failed to load dashboard data";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1 class="font-bold text-2xl">Dashboard Page</h1>

  <StateMessage
    :loading="loading"
    :error="error"
    :empty="!loading && !error && todos.length === 0"
    emptyText="No data available"
  />

  <div
    class="my-4 grid grid-cols-2 gap-3 md:grid-cols-4"
    v-if="!loading && !error && todos.length > 0"
  >
    <SummaryCard title="Team Members" :value="users.length" />
    <SummaryCard title="Total Tasks" :value="todos.length" />
    <SummaryCard title="Completed" :value="completedCount" />
    <SummaryCard title="Pending" :value="pendingCount" />
  </div>

  <h2 class="font-bold text-2xl">Recent Tasks</h2>
  <div
    v-for="tsk in recentTodos"
    :key="tsk.id"
    class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div>
      <router-link :to="'/tasks/' + tsk.id">{{ tsk.title }}</router-link>
    </div>
    <div>
      <span :class="tsk.completed ? 'text-green-600' : 'text-amber-700'">
        — {{ tsk.completed ? "Completed" : "Pending" }}</span
      >
    </div>
  </div>
</template>
