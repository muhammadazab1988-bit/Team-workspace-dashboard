<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

function handleLogin() {
  error.value = "";

  if (!email.value.trim() || !password.value) {
    error.value = "Please enter email and password";
    return;
  }

  loading.value = true;
  setTimeout(() => {
    const done = auth.login(email.value.trim(), password.value);
    loading.value = false;
    if (done) {
      router.push("/dashboard");
    } else {
      error.value = "Wrong email or password";
    }
  }, 600);
}
</script>

<template>
  <div class="mx-auto mt-16 max-w-sm rounded-lg bg-white p-6 shadow">
    <h1 class="mb-2 text-2xl font-bold">Demo Login</h1>
    <p class="mb-4 rounded bg-indigo-50 p-2 text-sm">
      Demo only, not real authentication. Use admin@demo.com / demo123
    </p>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-3">
      <input
        v-model="email"
        placeholder="Email"
        class="rounded border border-gray-300 px-3 py-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="rounded border border-gray-300 px-3 py-2"
      />
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <button
        :disabled="loading"
        class="rounded bg-green-600 px-3 py-2 text-white disabled:opacity-60"
      >
        {{ loading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>
