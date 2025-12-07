<script setup lang="ts">
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-vue-next";
import { ref } from "vue";

definePageMeta({
  middleware: "guest",
  layout: false,
});

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const displayName = ref("");
const error = ref("");
const isLoading = ref(false);

const handleRegister = async () => {
  error.value = "";
  isLoading.value = true;

  const result = await authStore.register(
    email.value,
    password.value,
    displayName.value || undefined
  );

  isLoading.value = false;

  if (result.success) {
    navigateTo("/");
  } else {
    error.value = result.error || "Registration failed";
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-netflix-dark flex items-center justify-center px-4"
  >
    <!-- Background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-max-purple/20 via-transparent to-netflix-red/20"
    />

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img
          src="/images/netflix-max.png"
          alt="Netflix Max"
          class="h-12 md:h-16 w-auto mx-auto"
        />
        <p class="text-gray-400 mt-4">Create your account</p>
      </div>

      <!-- Register Card -->
      <div
        class="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
      >
        <h2 class="text-white text-2xl font-bold mb-6">Sign Up</h2>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
        >
          {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Display Name -->
          <div>
            <label class="block text-gray-400 text-sm mb-2"
              >Display Name (optional)</label
            >
            <div class="relative">
              <User
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              />
              <input
                v-model="displayName"
                type="text"
                placeholder="John Doe"
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-max-purple focus:border-transparent transition-all"
              />
            </div>
          </div>

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
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-max-purple focus:border-transparent transition-all"
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
                minlength="6"
                class="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-max-purple focus:border-transparent transition-all"
              />
            </div>
            <p class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-max-purple to-purple-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <UserPlus v-else class="w-5 h-5" />
            {{ isLoading ? "Creating account..." : "Create Account" }}
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-gray-400 text-center mt-6">
          Already have an account?
          <NuxtLink to="/login" class="text-white hover:underline font-medium">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
