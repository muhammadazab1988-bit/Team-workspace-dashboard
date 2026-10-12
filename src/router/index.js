import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import LoginView from "../view/LoginView.vue";
import DashboardView from "../view/DashboardView.vue";
import TeamView from "../view/TeamView.vue";
import TeamDetailsView from "../view/TeamDetailView.vue";
import TasksView from "../view/TasksView.vue";
import TaskDetailsView from "../view/TasksDetailView.vue";
import DiscussionView from "../view/DiscussionDetailView.vue";
import NotFoundView from "../view/NotFoundView.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", component: LoginView },
  { path: "/dashboard", component: DashboardView, meta: { private: true } },
  { path: "/team", component: TeamView, meta: { private: true } },
  { path: "/team/:id", component: TeamDetailsView, meta: { private: true } },
  { path: "/tasks", component: TasksView, meta: { private: true } },
  { path: "/tasks/:id", component: TaskDetailsView, meta: { private: true } },
  {
    path: "/discussions/:id",
    component: DiscussionView,
    meta: { private: true },
  },
  { path: "/:pathMatch(.*)*", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.private && !auth.isAuthenticated) return "/login";
  if (to.path === "/login" && auth.isAuthenticated) return "/dashboard";
});

export default router;
