<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <nav
    class="flex items-center justify-between gap-4 bg-white px-5 py-3 shadow"
  >
    <div class="flex flex-1 items-center justify-center gap-4 text-lg">
      <router-link
        to="/dashboard"
        class="text-green-600 transition hover:underline"
        active-class="font-bold underline"
      >
        Dashboard
      </router-link>

      <router-link
        to="/team"
        class="text-green-600 transition hover:underline"
        active-class="font-bold underline"
      >
        Team
      </router-link>

      <router-link
        to="/tasks"
        class="text-green-600 transition hover:underline"
        active-class="font-bold underline"
      >
        Tasks
      </router-link>
    </div>

    <button
      @click="handleLogout"
      class="ml-auto rounded bg-green-600 px-3 py-2 text-white transition hover:bg-green-700"
    >
      Logout
    </button>
  </nav>
</template>
