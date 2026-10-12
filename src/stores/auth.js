import { defineStore } from "pinia";
import { ref } from "vue";

const demoEmail = "admin@demo.com";
const demoPassword = "demo123";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(localStorage.getItem("isLoggedIn") === "true");

  function login(email, password) {
    if (email === demoEmail && password === demoPassword) {
      isAuthenticated.value = true;
      localStorage.setItem("isLoggedIn", "true");
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    isAuthenticated.value = false;
    localStorage.removeItem("isLoggedIn");
  }

  return { isAuthenticated, login, logout };
});
