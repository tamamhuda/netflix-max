<script setup lang="ts">
import {
  Search as SearchIcon,
  Play,
  Star,
  Plus,
  Film,
  Tv,
} from "lucide-vue-next";
import { useContentStore } from "~/stores/content";
import { ref, computed, watch, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const contentStore = useContentStore();

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Separate states for URL query (?q=) and hero search bar
const urlQuery = ref(""); // From URL ?q=
const heroSearchQuery = ref(""); // From hero search bar
const searchDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);

// Results state
const searchResults = ref<any[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalResults = ref(0);
const selectedItem = ref<any>(null);
const showModal = ref(false);
const pageReady = ref(false);

// Filter state
const filterType = ref<"all" | "movie" | "tv">("all");

// Determine if we're showing search results (from either URL or hero search)
const hasSearchResults = computed(() => searchResults.value.length > 0);
const isSearching = computed(
  () => urlQuery.value.length >= 2 || heroSearchQuery.value.length >= 2
);

// On mount: fetch content and handle URL query
onMounted(async () => {
  await contentStore.fetchHomeContent();

  const q = route.query.q as string;
  if (q) {
    urlQuery.value = q;
    heroSearchQuery.value = q; // Sync hero input with URL
    performSearch(q);
  }

  setTimeout(() => {
    pageReady.value = true;
  }, 100);
});

// Watch for URL query changes
watch(
  () => route.query.q,
  (newQ) => {
    if (newQ) {
      urlQuery.value = newQ as string;
      heroSearchQuery.value = newQ as string;
      performSearch(newQ as string);
    } else {
      urlQuery.value = "";
      // Don't clear heroSearchQuery - let user keep typing
      if (!heroSearchQuery.value) {
        searchResults.value = [];
      }
    }
  }
);

// Debounced search from hero search bar (1 second delay)
watch(heroSearchQuery, (newVal) => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value);
  }

  if (!newVal || newVal.length < 2) {
    // Only clear results if URL also doesn't have a query
    if (!urlQuery.value) {
      searchResults.value = [];
    }
    return;
  }

  // 1 second debounce
  searchDebounceTimer.value = setTimeout(async () => {
    await performSearch(newVal);
  }, 1000);
});

const performSearch = async (query: string) => {
  if (!query || query.length < 2) return;

  isLoading.value = true;
  currentPage.value = 1;

  try {
    const result = await contentStore.searchContent(query, 1);
    const allResults = result.results || [];

    // Filter by type
    searchResults.value = allResults.filter((item: any) => {
      if (filterType.value === "all") {
        return item.media_type === "movie" || item.media_type === "tv";
      }
      return item.media_type === filterType.value;
    });

    totalPages.value = result.total_pages || 1;
    totalResults.value = result.total_results || 0;
  } catch (err) {
    console.error("Search error:", err);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch filter changes
watch(filterType, () => {
  currentPage.value = 1;
  const activeQuery = heroSearchQuery.value || urlQuery.value;
  if (activeQuery.length >= 2) performSearch(activeQuery);
});

const loadMore = async () => {
  if (currentPage.value >= totalPages.value) return;
  currentPage.value++;

  const activeQuery = heroSearchQuery.value || urlQuery.value;
  isLoading.value = true;

  try {
    const result = await contentStore.searchContent(
      activeQuery,
      currentPage.value
    );
    const newResults = (result.results || []).filter((item: any) => {
      if (filterType.value === "all") {
        return item.media_type === "movie" || item.media_type === "tv";
      }
      return item.media_type === filterType.value;
    });
    searchResults.value = [...searchResults.value, ...newResults];
  } finally {
    isLoading.value = false;
  }
};

const getPosterUrl = (path: string | null) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w342${path}`;
};

const getYear = (item: any) => {
  return (item.release_date || item.first_air_date || "").slice(0, 4);
};

const getMatch = (item: any) => {
  return Math.round((item.vote_average || 8) * 10);
};

const openDetail = (item: any) => {
  selectedItem.value = item;
  showModal.value = true;
};

const handleSelect = (item: any) => {
  selectedItem.value = {
    ...item,
    title: item.title || item.name,
    description: item.overview,
  };
  showModal.value = true;
};

// Display query for results header
const displayQuery = computed(() => heroSearchQuery.value || urlQuery.value);
</script>

<template>
  <div class="min-h-screen bg-netflix-dark pt-16">
    <!-- Hero Header (Always visible on /search) -->
    <div class="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <!-- Gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 via-40% to-netflix-dark"
      />

      <!-- Pattern overlay -->
      <div
        class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:32px_32px]"
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
        <div class="space-y-6 w-full max-w-2xl">
          <!-- Badge -->
          <div
            class="inline-flex items-center gap-3 p-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2"
          >
            <SearchIcon class="w-5 h-5 text-white" />
            <span class="text-white text-lg font-bold tracking-wider"
              >Search</span
            >
          </div>

          <h1 class="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Find Your Next <span class="text-netflix-red">Favorite</span>
          </h1>

          <p
            class="text-gray-300 text-base md:text-lg font-medium max-w-lg mx-auto"
          >
            Search millions of movies and TV shows
          </p>

          <!-- Large Search Bar -->
          <div class="relative mt-6">
            <div class="relative">
              <SearchIcon
                class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
              />
              <input
                v-model="heroSearchQuery"
                type="text"
                placeholder="Search movies, TV shows..."
                class="w-full pl-14 pr-6 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white text-base md:text-lg placeholder:text-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              />
              <!-- Loading indicator -->
              <div
                v-if="isLoading && heroSearchQuery.length >= 2"
                class="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <div
                  class="w-5 h-5 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"
                />
              </div>
            </div>
            <p
              v-if="heroSearchQuery.length >= 2 && !isLoading"
              class="absolute left-0 right-0 text-center text-gray-500 text-sm"
              style="bottom: -28px"
            >
              Results update automatically as you type
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="relative z-20 -mt-8">
      <!-- Results Header (when searching) -->
      <div v-if="isSearching && hasSearchResults" class="px-4 md:px-12 mb-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <p class="text-gray-400">
              <span v-if="totalResults > 0"
                >{{ totalResults }} results for
              </span>
              <span class="text-white font-semibold">"{{ displayQuery }}"</span>
            </p>

            <!-- Filter Tabs -->
            <div class="flex items-center gap-2">
              <button
                @click="filterType = 'all'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                :class="
                  filterType === 'all'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                "
              >
                All
              </button>
              <button
                @click="filterType = 'movie'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                :class="
                  filterType === 'movie'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                "
              >
                <Film class="w-4 h-4" />
                Movies
              </button>
              <button
                @click="filterType = 'tv'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                :class="
                  filterType === 'tv'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                "
              >
                <Tv class="w-4 h-4" />
                TV Shows
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State (initial) -->
      <div
        v-if="isLoading && !hasSearchResults && isSearching"
        class="flex items-center justify-center py-16"
      >
        <div class="text-center">
          <div
            class="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto"
          />
          <p class="text-gray-400 mt-4">Searching...</p>
        </div>
      </div>

      <!-- Search Results Grid -->
      <div v-else-if="hasSearchResults" class="px-4 md:px-12 pb-16">
        <div class="max-w-7xl mx-auto">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
          >
            <div
              v-for="item in searchResults"
              :key="item.id"
              @click="openDetail(item)"
              class="group relative cursor-pointer"
            >
              <div
                class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-2xl"
              >
                <img
                  v-if="getPosterUrl(item.poster_path)"
                  :src="getPosterUrl(item.poster_path)!"
                  :alt="item.title || item.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900"
                >
                  <Play class="w-12 h-12 text-gray-600" />
                </div>

                <div
                  class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <h3 class="text-white font-bold text-sm line-clamp-2 mb-2">
                      {{ item.title || item.name }}
                    </h3>
                    <div class="flex items-center gap-2 text-xs">
                      <span class="text-green-500 font-bold"
                        >{{ getMatch(item) }}%</span
                      >
                      <span class="text-gray-400">{{ getYear(item) }}</span>
                      <span
                        class="px-1.5 py-0.5 bg-white/20 rounded text-gray-300 capitalize"
                        >{{ item.media_type }}</span
                      >
                    </div>
                  </div>
                </div>

                <div
                  v-if="item.vote_average"
                  class="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white"
                >
                  <Star class="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {{ item.vote_average.toFixed(1) }}
                </div>
              </div>

              <h3
                class="md:hidden text-white text-sm font-medium mt-2 line-clamp-1"
              >
                {{ item.title || item.name }}
              </h3>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="currentPage < totalPages" class="flex justify-center mt-8">
            <button
              @click="loadMore"
              :disabled="isLoading"
              class="px-8 py-3 bg-netflix-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <div
                v-if="isLoading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              {{ isLoading ? "Loading..." : "Load More" }}
            </button>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-else-if="isSearching && !hasSearchResults && !isLoading"
        class="text-center py-16 px-4"
      >
        <SearchIcon class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 class="text-white text-xl font-semibold mb-2">No results found</h2>
        <p class="text-gray-400">Try a different search term</p>
      </div>

      <!-- Browse Content (shown when not searching) -->
      <div v-else class="pb-16 space-y-2 md:space-y-4">
        <ContentRow
          v-if="contentStore.trending.length"
          title="Trending Now"
          :items="contentStore.trending"
          @select="handleSelect"
        />
        <ContentRow
          v-if="contentStore.getNetflixContent.length"
          title="Netflix Originals"
          :items="contentStore.getNetflixContent"
          @select="handleSelect"
        />
        <ContentRow
          v-if="contentStore.hboContent.length"
          title="HBO Originals"
          :items="contentStore.hboContent"
          @select="handleSelect"
        />
      </div>
    </div>

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
