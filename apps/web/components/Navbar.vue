<script setup lang="ts">
import {
  Search,
  ChevronDown,
  Crown,
  LogOut,
  X,
  Play,
  Star,
} from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { useContentStore } from "~/stores/content";
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from "vue";

const route = useRoute();
const auth = useAuthStore();
const contentStore = useContentStore();
const isSearchOpen = ref(false);
const searchQuery = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const searchContainer = ref<HTMLElement | null>(null);
const isScrolled = ref(false);
const showUserMenu = ref(false);

// Search state
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const showResults = ref(false);
const searchDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const tabs = ["home", "series", "movies", "max", "my-list"];

// Compute current tab from route
const currentTab = computed(() => {
  const path = route.path;
  if (path === "/max") return "max";
  if (path === "/movies") return "movies";
  if (path === "/series") return "series";
  if (path === "/my-list") return "my-list";
  if (path === "/search") return "";
  return "home";
});

const setTab = (tab: string) => {
  switch (tab) {
    case "max":
      navigateTo("/max");
      break;
    case "movies":
      navigateTo("/movies");
      break;
    case "series":
      navigateTo("/series");
      break;
    case "my-list":
      navigateTo("/my-list");
      break;
    default:
      navigateTo("/");
  }
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  } else {
    closeSearch();
  }
};

const closeSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
  showResults.value = false;
  isSearchOpen.value = false;
};

// Debounced search with 1 second delay
watch(searchQuery, (newVal) => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value);
  }

  if (!newVal || newVal.length < 2) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  // 1 second debounce
  searchDebounceTimer.value = setTimeout(async () => {
    await performSearch(newVal);
  }, 1000);
});

const performSearch = async (query: string) => {
  isSearching.value = true;
  showResults.value = true;

  try {
    const result = await contentStore.searchContent(query, 1);
    // Filter out person results, only show movies and TV
    searchResults.value = (result.results || [])
      .filter(
        (item: any) => item.media_type === "movie" || item.media_type === "tv"
      )
      .slice(0, 6);
  } catch (err) {
    console.error("Search error:", err);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const getPosterUrl = (path: string | null) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w92${path}`;
};

const selectResult = (item: any) => {
  closeSearch();
  // Navigate to search page with the item highlighted
  navigateTo(`/search?q=${encodeURIComponent(item.title || item.name)}`);
};

// Handle Enter key - navigate to search page
const handleSearchKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && searchQuery.value.length >= 2) {
    e.preventDefault();
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    closeSearch();
  } else if (e.key === "Escape") {
    closeSearch();
  }
};

// Throttled scroll handler to prevent flickering
let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 20;
      ticking = false;
    });
    ticking = true;
  }
};

const handleLogout = () => {
  auth.logout();
  navigateTo("/login");
};

// Close search when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (searchContainer.value && !searchContainer.value.contains(target)) {
    if (isSearchOpen.value) {
      closeSearch();
    }
    showResults.value = false;
  }
};

onMounted(() => {
  isScrolled.value = window.scrollY > 20;
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("mousedown", handleClickOutside);
  if (searchDebounceTimer.value) clearTimeout(searchDebounceTimer.value);
});
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 will-change-transform"
    :class="[
      isScrolled || isSearchOpen
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-lg transition-colors duration-300'
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-colors duration-300',
    ]"
  >
    <div class="flex items-center justify-between px-4 py-3 md:px-12 md:py-4">
      <!-- Logo & Tabs -->
      <div class="flex items-center gap-6 md:gap-10">
        <div class="relative group cursor-pointer" @click="navigateTo('/')">
          <img
            src="/images/netflix-max.png"
            alt="Netflix Max"
            class="h-6 md:h-8 w-auto transition-all duration-300 group-hover:opacity-80"
          />
          <div
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-300 group-hover:w-full"
          />
        </div>

        <div
          class="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide max-w-[45vw] md:max-w-none items-center"
          v-if="!isSearchOpen"
        >
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="setTab(tab)"
            class="relative px-3 py-2 text-sm font-medium transition-all duration-300 capitalize flex items-center gap-1.5 whitespace-nowrap rounded-lg"
            :class="[
              currentTab === tab
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ]"
          >
            <Crown v-if="tab === 'max'" class="w-3.5 h-3.5 text-max-purple" />
            {{ tab.replace("-", " ") }}
            <div
              v-if="currentTab === tab"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-netflix-red to-max-purple rounded-full"
            />
          </button>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3 md:gap-5">
        <!-- Search -->
        <div ref="searchContainer" class="relative">
          <div
            class="flex items-center transition-all duration-400"
            :class="[
              isSearchOpen
                ? 'bg-black/80 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full w-64 md:w-80'
                : '',
            ]"
          >
            <Search
              class="w-5 h-5 text-gray-300 cursor-pointer hover:text-white transition-colors duration-200"
              @click="toggleSearch"
            />
            <input
              v-if="isSearchOpen"
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search movies, TV shows..."
              class="bg-transparent border-none focus:ring-0 focus:outline-none text-white text-sm ml-3 w-full placeholder:text-gray-500"
              @keydown="handleSearchKeydown"
            />
            <X
              v-if="isSearchOpen && searchQuery"
              class="w-4 h-4 text-gray-400 cursor-pointer hover:text-white flex-shrink-0"
              @click="closeSearch"
            />
          </div>

          <!-- Search Results Dropdown -->
          <div
            v-if="showResults && isSearchOpen"
            class="absolute top-full right-0 mt-2 w-80 md:w-96 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
          >
            <!-- Loading State -->
            <div v-if="isSearching" class="p-6 text-center">
              <div
                class="w-6 h-6 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto"
              />
              <p class="text-gray-400 text-sm mt-2">Searching...</p>
            </div>

            <!-- Results -->
            <div v-else-if="searchResults.length > 0">
              <div
                v-for="item in searchResults"
                :key="item.id"
                @click="selectResult(item)"
                class="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
              >
                <!-- Poster -->
                <div
                  class="w-12 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0"
                >
                  <img
                    v-if="getPosterUrl(item.poster_path)"
                    :src="getPosterUrl(item.poster_path)!"
                    :alt="item.title || item.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <Play class="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-medium text-sm truncate">
                    {{ item.title || item.name }}
                  </h4>
                  <div
                    class="flex items-center gap-2 mt-1 text-xs text-gray-400"
                  >
                    <span class="capitalize px-1.5 py-0.5 bg-white/10 rounded">
                      {{ item.media_type }}
                    </span>
                    <span>{{
                      (item.release_date || item.first_air_date || "").slice(
                        0,
                        4
                      )
                    }}</span>
                    <span
                      v-if="item.vote_average"
                      class="flex items-center gap-0.5"
                    >
                      <Star class="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {{ item.vote_average.toFixed(1) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- View All Results -->
              <button
                @click="
                  navigateTo(`/search?q=${encodeURIComponent(searchQuery)}`);
                  closeSearch();
                "
                class="w-full p-3 text-center text-sm text-netflix-red hover:bg-white/5 transition-colors font-medium"
              >
                View all results for "{{ searchQuery }}"
              </button>
            </div>

            <!-- No Results -->
            <div
              v-else-if="searchQuery.length >= 2 && !isSearching"
              class="p-6 text-center"
            >
              <p class="text-gray-400 text-sm">
                No results found for "{{ searchQuery }}"
              </p>
              <p class="text-gray-500 text-xs mt-1">
                Press Enter to search on full page
              </p>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div
          class="relative"
          @click="showUserMenu = !showUserMenu"
          @blur="showUserMenu = false"
        >
          <div class="flex items-center gap-2 group cursor-pointer">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-all duration-300 shadow-lg"
              :class="[
                auth.hasMaxAccess
                  ? 'bg-gradient-to-br from-max-purple to-purple-700 hover:shadow-glow-purple'
                  : 'bg-gradient-to-br from-netflix-red to-red-700 hover:shadow-glow-red',
              ]"
            >
              {{
                auth.user?.displayName?.[0]?.toUpperCase() ||
                (auth.user?.subscription === "max" ? "M" : "U")
              }}
            </div>
            <ChevronDown
              class="w-4 h-4 text-gray-400 group-hover:text-white transition-all duration-200"
              :class="showUserMenu ? 'rotate-180' : ''"
            />
          </div>

          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div class="p-3 border-b border-white/10">
              <p class="text-white font-medium text-sm truncate">
                {{ auth.user?.displayName || auth.user?.email }}
              </p>
              <p class="text-gray-500 text-xs capitalize">
                {{ auth.user?.subscription }} Plan
              </p>
            </div>
            <button
              @click="auth.togglePlan()"
              class="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {{ auth.hasMaxAccess ? "Switch to Basic" : "Upgrade to Max" }}
            </button>
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
            >
              <LogOut class="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
