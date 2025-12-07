<script setup lang="ts">
import { Crown, Lock, Sparkles } from "lucide-vue-next";
import TitleDetailModal from "~/components/TitleDetailModal.vue";
import { ref, computed, onMounted } from "vue";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const contentStore = useContentStore();
const maxContent = computed(() => contentStore.getMaxContent);
const selectedTitle = ref<any>(null);
const pageReady = ref(false);

const handleSelect = (item: any) => {
  selectedTitle.value = {
    ...item,
    title: item.title || item.name,
    description: item.overview,
    year:
      item.release_date?.slice(0, 4) ||
      item.first_air_date?.slice(0, 4) ||
      "2024",
    match: Math.round(item.vote_average * 10) || 90,
    rating: "TV-MA",
  };
};

onMounted(async () => {
  await contentStore.fetchHomeContent();
  setTimeout(() => {
    pageReady.value = true;
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-netflix-dark pt-16">
    <!-- Hero Header -->
    <div class="relative h-[45vh] md:h-[55vh] overflow-hidden">
      <!-- Animated gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-max-purple via-purple-800 via-40% to-blue-900 animated-gradient"
        style="background-size: 200% 200%"
      />

      <!-- Pattern overlay -->
      <div
        class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:32px_32px]"
      />

      <!-- Gradient overlays -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent"
      />

      <!-- Content -->
      <div
        class="relative h-full flex items-center justify-center text-center px-4 z-10 transition-all duration-700"
        :class="
          pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        "
      >
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-3 p-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
          >
            <Crown class="w-6 h-6 text-white" />
            <span class="text-white text-lg font-bold tracking-wider">MAX</span>
          </div>
          <h1 class="text-4xl md:text-7xl font-bold text-white tracking-tight">
            Netflix <span class="text-max-purple">Max</span>
          </h1>
          <p
            class="text-gray-300 text-lg md:text-xl font-medium max-w-lg mx-auto"
          >
            HBO. DC. Warner Bros. All in one place.
          </p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="relative z-20 -mt-16 pb-16">
      <!-- Loading State -->
      <div v-if="contentStore.isLoading" class="flex justify-center py-20">
        <div
          class="w-8 h-8 border-4 border-max-purple border-t-transparent rounded-full animate-spin"
        />
      </div>

      <!-- Upgrade Gate for Basic Users -->
      <div
        v-else-if="!authStore.hasMaxAccess"
        class="px-4 md:px-12 py-12 transition-all duration-500"
        :class="
          pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        "
      >
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl p-8 md:p-12 max-w-2xl mx-auto border border-white/10 text-center"
        >
          <!-- Background glow -->
          <div
            class="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-max-purple/20 rounded-full blur-3xl"
          />

          <div class="relative">
            <div
              class="inline-flex p-4 rounded-2xl bg-gradient-to-br from-max-purple/20 to-purple-600/10 border border-max-purple/30 mb-6"
            >
              <Lock class="w-10 h-10 text-max-purple" />
            </div>

            <h2 class="text-white text-2xl md:text-3xl font-bold mb-3">
              Upgrade to Netflix Max
            </h2>
            <p class="text-gray-400 mb-8 max-w-md mx-auto">
              Get unlimited access to HBO Originals, the DC Universe, Warner
              Bros films, and more premium content.
            </p>

            <button
              @click="authStore.togglePlan()"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-max-purple to-purple-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-max-purple/30 hover:scale-105"
            >
              <Sparkles class="w-5 h-5" />
              Switch to Max Plan
            </button>
          </div>
        </div>
      </div>

      <!-- Content Rows for Max Users -->
      <div v-else class="space-y-2 md:space-y-4 mt-8">
        <ContentRow
          title="HBO Originals"
          :items="maxContent.hboOriginals"
          @select="handleSelect"
        />
        <ContentRow
          title="DC Universe"
          :items="maxContent.dcUniverse"
          @select="handleSelect"
        />
        <ContentRow
          title="Warner Bros Films"
          :items="maxContent.wbFilms"
          @select="handleSelect"
        />
      </div>
    </div>

    <TitleDetailModal
      v-if="selectedTitle"
      :title="selectedTitle"
      @close="selectedTitle = null"
    />
  </div>
</template>
