<script setup lang="ts">
import { Crown } from "lucide-vue-next";
import UpsellModal from "~/components/UpsellModal.vue";
import TitleDetailModal from "~/components/TitleDetailModal.vue";
import { ref, onMounted, computed } from "vue";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const contentStore = useContentStore();

// State
const showUpsell = ref(false);
const selectedTitle = ref<any>(null);
const pageReady = ref(false);

// Computed
const isMaxLocked = computed(() => !authStore.hasMaxAccess);
const maxContent = computed(() => contentStore.getMaxContent);

const handleSelect = (item: any) => {
  if (item.isMax && isMaxLocked.value) {
    showUpsell.value = true;
  } else {
    // Add display properties for modal
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
  }
};

onMounted(async () => {
  await contentStore.fetchHomeContent();
  setTimeout(() => {
    pageReady.value = true;
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-netflix-dark">
    <Hero />

    <div class="relative z-20 -mt-24 md:-mt-32 pb-16 space-y-2 md:space-y-4">
      <!-- Loading State -->
      <div v-if="contentStore.isLoading" class="flex justify-center py-20">
        <div
          class="w-8 h-8 border-4 border-max-purple border-t-transparent rounded-full animate-spin"
        />
      </div>

      <template v-else>
        <!-- Max Promo Banner -->
        <div
          v-if="authStore.hasMaxAccess"
          class="px-4 md:px-12 mb-6 transition-all duration-500"
          :class="
            pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          "
        >
          <div
            class="relative overflow-hidden rounded-xl bg-gradient-to-r from-max-purple/20 via-purple-900/10 to-transparent py-4 px-5 border-l-4 border-max-purple backdrop-blur-sm"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-max-purple/5 to-transparent"
            />
            <div
              class="relative flex items-center gap-3 text-white font-semibold"
            >
              <div class="p-1.5 rounded-lg bg-max-purple/20">
                <Crown class="w-4 h-4 text-max-purple" />
              </div>
              Because you have Netflix Max – enjoy exclusive content
            </div>
          </div>
        </div>

        <!-- Content Rows -->
        <!-- Trending Row (First) -->
        <ContentRow
          v-if="contentStore.trending.length"
          title="Trending Now"
          :items="contentStore.trending"
          @select="handleSelect"
        />

        <ContentRow
          title="Netflix Originals"
          :items="contentStore.getNetflixContent"
          @select="handleSelect"
        />

        <ContentRow
          title="HBO Originals"
          :items="maxContent.hboOriginals"
          :locked="isMaxLocked"
          @select="handleSelect"
        />

        <ContentRow
          title="DC Universe"
          :items="maxContent.dcUniverse"
          :locked="isMaxLocked"
          @select="handleSelect"
        />

        <ContentRow
          title="Warner Bros"
          :items="maxContent.wbFilms"
          :locked="isMaxLocked"
          @select="handleSelect"
        />
      </template>
    </div>

    <!-- Modals -->
    <UpsellModal v-if="showUpsell" @close="showUpsell = false" />
    <TitleDetailModal
      v-if="selectedTitle"
      :title="selectedTitle"
      @close="selectedTitle = null"
    />
  </div>
</template>
