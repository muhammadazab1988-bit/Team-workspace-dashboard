<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";
import StateMessage from "../components/StateMessage.vue";

const users = ref([]);
const search = ref("");
const loading = ref(true);
const error = ref("");

const filteredUsers = computed(() =>
  users.value.filter((u) =>
    u.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

onMounted(async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    error.value = "Failed to load team members";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1 class="text-2xl font-bold">Team Members</h1>
  <input
    v-model="search"
    placeholder="Search by name..."
    class="my-3 w-full max-w-xs rounded-xl border-2 border-gray-300 px-3 py-2"
  />

  <StateMessage
    :loading="loading"
    :error="error"
    :empty="!loading && !error && filteredUsers.length === 0"
    emptyText="No members found"
  />
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="el in filteredUsers"
      :key="el.id"
      class="rounded-lg bg-white p-4 shadow"
    >
      <h3 class="font-bold">
        <router-link
          :to="'/team/' + el.id"
          class="text-red-600 hover:underline"
          >{{ el.name }}</router-link
        >
      </h3>
      <p>Username: {{ el.username }}</p>
      <p>Email: {{ el.email }}</p>
      <p>Phone: {{ el.phone }}</p>
      <p>Company: {{ el.company.name }}</p>
    </div>
  </div>
</template>
