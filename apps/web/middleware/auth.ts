export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side to prevent flash
  if (import.meta.server) {
    return;
  }

  const authStore = useAuthStore();

  // Initialize auth from localStorage if not done yet
  if (!authStore.token) {
    authStore.init();
  }

  // If still not authenticated after init, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
