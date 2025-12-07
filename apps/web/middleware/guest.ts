export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (import.meta.server) {
    return;
  }

  const authStore = useAuthStore();

  // Initialize auth from localStorage if not done yet
  if (!authStore.token) {
    authStore.init();
  }

  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    return navigateTo("/");
  }
});
