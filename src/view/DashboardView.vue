<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";
import SummaryCard from "../components/SummaryCard.vue";
import StateMessage from "../components/StateMessage.vue";

const users = ref([]);
const todos = ref([]);
const loading = ref(true);
const error = ref("");
const recentFilter = ref("all");

async function loadData() {
  loading.value = true;
  error.value = "";
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
}
onMounted(loadData);

function percentOf(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

const completedCount = computed(
  () => todos.value.filter((t) => t.completed).length,
);
const pendingCount = computed(() => todos.value.length - completedCount.value);
const completedPercent = computed(() =>
  percentOf(completedCount.value, todos.value.length),
);

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ringOffset = computed(
  () => CIRCUMFERENCE * (1 - completedPercent.value / 100),
);

const topMembers = computed(() =>
  users.value
    .map((usr) => {
      const userTodos = todos.value.filter((todo) => todo.userId === usr.id);
      const completedTodos = userTodos.filter((todo) => todo.completed).length;
      return {
        id: usr.id,
        name: usr.name,
        company: usr.company.name,
        done: completedTodos,
        total: userTodos.length,
        percent: percentOf(completedTodos, userTodos.length),
      };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4),
);

function getUserName(userId) {
  const user = users.value.find((usr) => usr.id === userId);
  return user ? user.name : "Unknown";
}
const recentTodos = computed(() => {
  const last5 = todos.value.slice(-5).reverse();
  if (recentFilter.value === "completed")
    return last5.filter((todo) => todo.completed);
  if (recentFilter.value === "pending")
    return last5.filter((todo) => !todo.completed);
  return last5;
});
</script>

<template>
  <section
    class="rounded-3xl bg-linear-to-r from-gray-950 via-green-600 to-gray-900 p-6 text-white shadow-lg sm:p-8"
  >
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold">Workspace Overview</h1>
        <p class="mt-2 max-w-md text-sm text-gray-300">
          Welcome back, Admin. Track progress across team members and tasks.
        </p>
      </div>
      <div class="flex gap-2">
        <router-link
          to="/tasks"
          class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:shadow-md"
        >
          + Manage Tasks
        </router-link>
      </div>
    </div>
  </section>

  <StateMessage
    :loading="loading"
    :error="error"
    :empty="!loading && !error && todos.length === 0"
    emptyText="No data available"
  />

  <div v-if="!loading && !error && todos.length > 0">
    <div class="my-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      <SummaryCard
        title="Team Members"
        :value="users.length"
        :percent="100"
        note="Members in workspace"
        color="bg-blue-500"
      />
      <SummaryCard
        title="Total Tasks"
        :value="todos.length"
        :percent="100"
        note="Across all members"
        color="bg-indigo-500"
      />
      <SummaryCard
        title="Completed"
        :value="completedCount"
        :percent="completedPercent"
        :note="completedPercent + '% of all tasks'"
        color="bg-green-500"
      />
      <SummaryCard
        title="Pending"
        :value="pendingCount"
        :percent="100 - completedPercent"
        :note="100 - completedPercent + '% of all tasks'"
        color="bg-amber-500"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
      >
        <h2 class="font-bold text-slate-800">Workspace Completion</h2>
        <div class="relative mx-auto my-5 h-44 w-44">
          <svg viewBox="0 0 120 120" class="h-full w-full">
            <circle
              cx="60"
              cy="60"
              :r="RADIUS"
              fill="none"
              stroke="#e2e8f0"
              stroke-width="10"
            />
            <circle
              cx="60"
              cy="60"
              :r="RADIUS"
              fill="none"
              stroke="#10b981"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="CIRCUMFERENCE"
              :stroke-dashoffset="ringOffset"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span class="text-3xl font-bold text-slate-900"
              >{{ completedPercent }}%</span
            >
            <span class="text-xs text-slate-500">completed</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="rounded-lg bg-slate-50 p-2">
            <p class="text-xs text-slate-500">Finished</p>
            <p class="font-bold text-green-600">{{ completedCount }} items</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-2">
            <p class="text-xs text-slate-500">Pending</p>
            <p class="font-bold text-amber-600">{{ pendingCount }} items</p>
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-800">Team Progress</h2>
          <router-link
            to="/team"
            class="text-sm text-green-600 hover:underline"
          >
            View all members
          </router-link>
        </div>
        <p class="mt-1 text-sm text-slate-500">
          Top 4 members by completion rate.
        </p>

        <div class="mt-4 space-y-3">
          <div
            v-for="member in topMembers"
            :key="member.id"
            class="rounded-xl border border-slate-100 p-3 font-bold"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700"
              >
                {{ member.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-slate-800">
                  {{ member.name }}
                </p>
                <p class="text-xs text-slate-400">{{ member.company }}</p>
              </div>
              <p class="text-sm text-slate-600">
                {{ member.done }} / {{ member.total }} tasks ({{
                  member.percent
                }}%)
              </p>
            </div>
            <div class="mt-2 h-1.5 rounded-full bg-slate-100">
              <div
                class="h-1.5 rounded-full bg-green-500"
                :style="{ width: member.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section
      class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="font-bold text-slate-800">Recent Tasks</h2>
        <div class="flex gap-1">
          <button
            v-for="f in ['all', 'completed', 'pending']"
            :key="f"
            @click="recentFilter = f"
            class="rounded-lg px-3 py-1 text-sm capitalize"
            :class="
              recentFilter === f
                ? 'bg-gray-900 text-white'
                : 'bg-slate-100 text-slate-600'
            "
          >
            {{ f }}
          </button>
        </div>
      </div>

      <p v-if="recentTodos.length === 0" class="mt-4 text-sm text-slate-500">
        No tasks match this filter.
      </p>

      <div
        v-for="todo in recentTodos"
        :key="todo.id"
        class="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3"
      >
        <span
          class="flex h-5 w-5 items-center justify-center rounded border text-xs"
          :class="
            todo.completed
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-slate-300'
          "
        >
          {{ todo.completed ? "✓" : "" }}
        </span>
        <div class="flex-1">
          <p
            class="text-sm font-semibold"
            :class="
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
            "
          >
            {{ todo.title }}
          </p>
          <p class="text-xs text-slate-400">
            #{{ todo.id }} · {{ getUserName(todo.userId) }}
          </p>
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs"
          :class="
            todo.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          "
        >
          {{ todo.completed ? "Completed" : "Pending" }}
        </span>
        <router-link
          :to="'/tasks/' + todo.id"
          class="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
        >
          Inspect
        </router-link>
      </div>
    </section>
  </div>
</template>
