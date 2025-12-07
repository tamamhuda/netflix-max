<script setup lang="ts">
import { Tv, Play, Plus, Check, Star } from "lucide-vue-next";
import { useContentStore } from "~/stores/content";
import { useMyList } from "~/composables/useMyList";
import { ref, onMounted, computed } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const contentStore = useContentStore();
const { isInList, toggleInList } = useMyList();
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const isLoading = ref(true);
const selectedItem = ref<any>(null);
const showModal = ref(false);

// My List state for featured series
const isFeaturedInMyList = computed(() => {
  if (!featuredSeries.value) return false;
  return isInList(featuredSeries.value.id);
});

const handleToggleMyList = () => {
  if (!featuredSeries.value) return;
  toggleInList({
    ...featuredSeries.value,
    media_type: "tv",
  });
};

// Build rows from homeContent - filter only TV shows
const seriesRows = computed(() => {
  if (!contentStore.homeContent) return [];

  const rows: { title: string; items: any[] }[] = [];
  const home = contentStore.homeContent;

  // Helper to filter TV shows
  const filterTVShows = (items: any[]) =>
    items.filter(
      (item) =>
        item.media_type === "tv" ||
        (!item.media_type && item.name && !item.title)
    );

  if (home.trending?.length) {
    const shows = filterTVShows(home.trending);
    if (shows.length) rows.push({ title: "Trending TV Shows", items: shows });
  }

  if (home.netflixOriginals?.length) {
    const shows = filterTVShows(home.netflixOriginals);
    if (shows.length) rows.push({ title: "Netflix Series", items: shows });
  }

  if (home.hbo?.length) {
    const shows = filterTVShows(home.hbo);
    if (shows.length) rows.push({ title: "HBO Series", items: shows });
  }

  if (home.dc?.length) {
    const shows = filterTVShows(home.dc);
    if (shows.length) rows.push({ title: "DC Series", items: shows });
  }

  if (home.wb?.length) {
    const shows = filterTVShows(home.wb);
    if (shows.length) rows.push({ title: "Warner Bros Series", items: shows });
  }

  return rows;
});

// Featured series for hero
const featuredSeries = computed(() => {
  const trendingRow = seriesRows.value.find((r) =>
    r.title.includes("Trending")
  );
  return trendingRow?.items?.[0] || seriesRows.value[0]?.items?.[0] || null;
});

onMounted(async () => {
  await contentStore.fetchHomeContent();
  isLoading.value = false;
});

const getBackdropUrl = (path: string | null) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w1280${path}`;
};

const getYear = (item: any) => {
  return (item.release_date || item.first_air_date || "").slice(0, 4);
};

const getMatch = (item: any) => {
  return Math.round((item.vote_average || 8) * 10);
};

const openDetail = (item: any) => {
  selectedItem.value = { ...item, media_type: "tv" };
  showModal.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-netflix-dark">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-max-purple border-t-transparent rounded-full animate-spin mx-auto"
        />
        <p class="text-gray-400 mt-4">Loading series...</p>
      </div>
    </div>

    <template v-else>
      <!-- Hero Section -->
      <div v-if="featuredSeries" class="relative h-[70vh] overflow-hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0">
          <img
            v-if="getBackdropUrl(featuredSeries.backdrop_path)"
            :src="getBackdropUrl(featuredSeries.backdrop_path)!"
            :alt="featuredSeries.name || featuredSeries.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-max-purple to-gray-900"
          />
        </div>

        <!-- Gradient Overlays -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/60 to-transparent"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-netflix-dark via-transparent to-transparent"
        />

        <!-- Content -->
        <div
          class="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-32 md:pb-40"
        >
          <div class="max-w-2xl">
            <div class="flex items-center gap-2 mb-4">
              <Tv class="w-5 h-5 text-max-purple" />
              <span
                class="text-max-purple font-bold text-sm uppercase tracking-wider"
                >TV Series</span
              >
            </div>

            <h1 class="text-white text-4xl md:text-6xl font-bold mb-4">
              {{ featuredSeries.name || featuredSeries.title }}
            </h1>

            <div class="flex items-center gap-4 mb-4 text-sm">
              <span class="text-green-500 font-bold"
                >{{ getMatch(featuredSeries) }}% Match</span
              >
              <span class="text-gray-400">{{ getYear(featuredSeries) }}</span>
              <span
                class="px-2 py-0.5 bg-white/10 rounded text-gray-300 text-xs"
                >HD</span
              >
            </div>

            <p class="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
              {{ featuredSeries.overview }}
            </p>

            <div class="flex items-center gap-3">
              <button
                @click="openDetail(featuredSeries)"
                class="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all"
              >
                <Play class="w-5 h-5 fill-current" />
                Play
              </button>
              <button
                @click="handleToggleMyList"
                class="flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all backdrop-blur-sm"
                :class="
                  isFeaturedInMyList
                    ? 'bg-green-600/30 text-green-400 border border-green-500/50 hover:bg-green-600/40'
                    : 'bg-white/20 text-white hover:bg-white/30'
                "
              >
                <Check v-if="isFeaturedInMyList" class="w-5 h-5" />
                <Plus v-else class="w-5 h-5" />
                {{ isFeaturedInMyList ? "In My List" : "My List" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Series Rows -->
      <div class="relative z-20 -mt-24 md:-mt-32 pb-16 space-y-2 md:space-y-4">
        <div v-for="row in seriesRows" :key="row.title" class="mb-8">
          <ContentRow
            :title="row.title"
            :items="row.items"
            @select="openDetail"
          />
        </div>

        <!-- Empty State -->
        <div v-if="seriesRows.length === 0" class="text-center py-20 pt-40">
          <Tv class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 class="text-white text-xl font-semibold mb-2">
            No series available
          </h2>
          <p class="text-gray-400">Check back later for new content</p>
        </div>
      </div>
    </template>

    <!-- Detail Modal -->
    <TitleDetailModal
      v-if="showModal && selectedItem"
      :title="selectedItem"
      @close="
        showModal = false;
        selectedItem = null;
      "
    />
  </div>
</template>
