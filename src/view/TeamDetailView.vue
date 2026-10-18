<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios.js";
import StateMessage from "../components/StateMessage.vue";

const route = useRoute();
const user = ref("");
const posts = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const res = await api.get("/users/" + route.params.id);
    user.value = res.data;

    const postsRes = await api.get("/posts");
    posts.value = postsRes.data.filter((post) => post.userId === user.value.id);
  } catch (err) {
    error.value =
      err.response?.status === 404
        ? "Member not found (invalid ID)"
        : "Failed to load member";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <router-link
        to="/team"
        class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-gray-500"
      >
        <span aria-hidden="true">←</span>
        Back to team
      </router-link>

      <StateMessage :loading="loading" :error="error" />

      <div
        v-if="user"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
      >
        <header
          class="bg-linear-to-r from-green-600 via-red-600 to-green-600 px-5 py-6 sm:px-8 sm:py-8"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white shadow-inner shadow-white/20"
            >
              {{ user.name.charAt(0) }}
            </div>

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100"
              >
                Team member
              </p>
              <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {{ user.name }}
              </h1>
              <p class="mt-1 text-sm text-indigo-100">@{{ user.username }}</p>
            </div>
          </div>
        </header>

        <div class="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          <section
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <h3
              class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
            >
              Contact
            </h3>

            <div class="mt-4 space-y-4">
              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  Email
                </p>
                <p class="mt-1 break-all text-sm font-semibold text-slate-700">
                  {{ user.email }}
                </p>
              </div>

              <div>
                <p
                  class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  Phone
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ user.phone }}
                </p>
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <h3
              class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
            >
              Address
            </h3>

            <p class="mt-4 text-sm leading-7 text-slate-700">
              {{ user.address.street }}, {{ user.address.suite }}<br />
              {{ user.address.city }} {{ user.address.zipcode }}
            </p>
          </section>

          <section
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 sm:col-span-2 xl:col-span-1"
          >
            <h3
              class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500"
            >
              Company
            </h3>

            <div class="mt-4">
              <p class="text-base font-bold text-slate-800">
                {{ user.company.name }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ user.company.catchPhrase }}
              </p>
            </div>
          </section>
        </div>

        <section class="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-800">Discussions</h3>
            <span
              class="inline-flex min-w-2rem items-center justify-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700"
            >
              {{ posts.length }}
            </span>
          </div>

          <ul v-if="posts.length" class="space-y-3">
            <li
              v-for="post in posts"
              :key="post.id"
              class="rounded-xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <router-link
                :to="'/discussions/' + post.id"
                class="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:text-indigo-600"
              >
                {{ post.title }}
              </router-link>
            </li>
          </ul>

          <p v-else class="text-sm text-slate-500">
            No discussions posted by this member yet.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
