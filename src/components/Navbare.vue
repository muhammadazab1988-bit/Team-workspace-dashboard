<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <nav
    class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-white px-3 py-3 shadow sm:gap-3 sm:px-5"
  >
    <div class="flex shrink-0 items-center gap-2">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 font-bold text-white"
      >
        TW
      </div>
      <span class="whitespace-nowrap text-sm font-bold sm:text-base">Team Workspace</span>
    </div>

    <div
      id="primary-navigation"
      :class="menuOpen ? 'flex' : 'hidden'"
      class="order-3 w-full flex-col gap-1 rounded-xl px-2 py-2 text-sm text-gray-600 shadow-[inset_3px_3px_6px_#b8babb,inset_-3px_-3px_6px_#eef0f0] sm:order-none sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:whitespace-nowrap sm:px-3 sm:py-3 sm:text-lg"
    >
      <router-link
        to="/dashboard"
        class="shrink-0 rounded-lg px-2 py-2 text-sm text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-[inset_3px_3px_6px_#b8babb,inset_-3px_-3px_6px_#eef0f0] active:scale-95 sm:px-3"
        active-class="bg-gray-100 font-bold text-gray-900"
        @click="menuOpen = false"
      >
        Dashboard
      </router-link>
      <router-link
        to="/team"
        class="shrink-0 rounded-lg px-2 py-2 text-sm text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-[inset_3px_3px_6px_#b8babb,inset_-3px_-3px_6px_#eef0f0] active:scale-95 sm:px-3"
        active-class="bg-gray-100 font-bold text-gray-900"
        @click="menuOpen = false"
      >
        Team
      </router-link>
      <router-link
        to="/tasks"
        class="shrink-0 rounded-lg px-2 py-2 text-sm text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100 hover:shadow-[inset_3px_3px_6px_#b8babb,inset_-3px_-3px_6px_#eef0f0] active:scale-95 sm:px-3"
        active-class="bg-gray-100 font-bold text-gray-900"
        @click="menuOpen = false"
      >
        Tasks
      </router-link>
    </div>

    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
      <span class="whitespace-nowrap text-sm text-green-600">Admin</span>
      <button
        type="button"
        class="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg border border-gray-300 sm:hidden"
        :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
        aria-controls="primary-navigation"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span
          class="h-0.5 w-5 bg-gray-700 transition-transform"
          :class="menuOpen ? 'translate-y-1.5 rotate-45' : ''"
        ></span>
        <span
          class="h-0.5 w-5 bg-gray-700 transition-opacity"
          :class="menuOpen ? 'opacity-0' : ''"
        ></span>
        <span
          class="h-0.5 w-5 bg-gray-700 transition-transform"
          :class="menuOpen ? '-translate-y-1.5 -rotate-45' : ''"
        ></span>
      </button>
      <button
        @click="handleLogout"
        class="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 shadow-[inset_3px_3px_6px_#b8babb,inset_-3px_-3px_6px_#eef0f0]"
      >
        Logout
      </button>
    </div>
  </nav>
</template>
