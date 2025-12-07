<script setup lang="ts">
import { Mail, Lock, LogIn, Loader2 } from "lucide-vue-next";
import { ref } from "vue";

definePageMeta({
  middleware: "guest",
  layout: false,
});

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  const result = await authStore.login(email.value, password.value);

  isLoading.value = false;

  if (result.success) {
    navigateTo("/");
  } else {
    error.value = result.error || "Login failed";
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-netflix-dark flex items-center justify-center px-4"
  >
    <!-- Background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-netflix-red/20 via-transparent to-max-purple/20"
    />

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img
          src="/images/netflix-max.png"
          alt="Netflix Max"
          class="h-12 md:h-16 w-auto mx-auto"
        />
        <p class="text-gray-400 mt-4">Sign in to continue</p>
      </div>

      <!-- Login Card -->
      <div
        class="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
      >
        <h2 class="text-white text-2xl font-bold mb-6">Sign In</h2>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">Email</label>
            <div class="relative">
              <Mail
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              />
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-400 text-sm mb-2">Password</label>
            <div class="relative">
              <Lock
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all"
              />
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-netflix-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <LogIn v-else class="w-5 h-5" />
            {{ isLoading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

        <!-- Register Link -->
        <p class="text-gray-400 text-center mt-6">
          New to Netflix?
          <NuxtLink
            to="/register"
            class="text-white hover:underline font-medium"
          >
            Sign up now
          </NuxtLink>
        </p>
      </div>

      <!-- Demo Hint -->
      <p class="text-gray-500 text-center text-sm mt-6">
        Demo: test@example.com / password123
      </p>
    </div>
  </div>
</template>
