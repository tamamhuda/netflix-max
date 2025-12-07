<script setup lang="ts">
import { List, Film, Tv, Play, Plus, Trash2, Star } from "lucide-vue-next";
import { useMyList } from "~/composables/useMyList";
import { ref, computed, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const { myList, moviesList, seriesList, removeFromList, clearList, listCount } =
  useMyList();

const selectedItem = ref<any>(null);
const showModal = ref(false);
const activeFilter = ref<"all" | "movies" | "series">("all");

// Filtered content based on active filter
const filteredList = computed(() => {
  if (activeFilter.value === "movies") return moviesList.value;
  if (activeFilter.value === "series") return seriesList.value;
  return myList.value;
});

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

const handleRemove = (e: Event, id: number) => {
  e.stopPropagation();
  removeFromList(id);
};

const handleClearAll = () => {
  if (confirm("Are you sure you want to clear your entire list?")) {
    clearList();
  }
};
</script>

<template>
  <div class="min-h-screen bg-netflix-dark pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 md:px-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div class="flex items-center gap-3">
            <List class="w-8 h-8 text-netflix-red" />
            <h1 class="text-white text-2xl md:text-4xl font-bold">My List</h1>
            <span
              v-if="listCount > 0"
              class="px-3 py-1 bg-white/10 rounded-full text-gray-300 text-sm"
            >
              {{ listCount }} {{ listCount === 1 ? "title" : "titles" }}
            </span>
          </div>

          <button
            v-if="listCount > 0"
            @click="handleClearAll"
            class="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 class="w-4 h-4" />
            Clear All
          </button>
        </div>

        <!-- Filter Tabs -->
        <div v-if="listCount > 0" class="flex items-center gap-2">
          <button
            @click="activeFilter = 'all'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="
              activeFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            "
          >
            All ({{ myList.length }})
          </button>
          <button
            @click="activeFilter = 'movies'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
            :class="
              activeFilter === 'movies'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            "
          >
            <Film class="w-4 h-4" />
            Movies ({{ moviesList.length }})
          </button>
          <button
            @click="activeFilter = 'series'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
            :class="
              activeFilter === 'series'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            "
          >
            <Tv class="w-4 h-4" />
            Series ({{ seriesList.length }})
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="listCount === 0" class="text-center py-20">
        <div
          class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6"
        >
          <List class="w-12 h-12 text-gray-600" />
        </div>
        <h2 class="text-white text-xl font-semibold mb-3">
          Your list is empty
        </h2>
        <p class="text-gray-400 max-w-md mx-auto mb-8">
          Add movies and TV shows to your list by clicking the + button on any
          title
        </p>

        <div class="flex items-center justify-center gap-4">
          <NuxtLink
            to="/movies"
            class="flex items-center gap-2 px-6 py-3 bg-netflix-red text-white font-bold rounded-lg hover:bg-red-700 transition-all"
          >
            <Film class="w-5 h-5" />
            Browse Movies
          </NuxtLink>
          <NuxtLink
            to="/series"
            class="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
          >
            <Tv class="w-5 h-5" />
            Browse Series
          </NuxtLink>
        </div>
      </div>

      <!-- Content Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
      >
        <div
          v-for="item in filteredList"
          :key="item.id"
          @click="openDetail(item)"
          class="group relative cursor-pointer"
        >
          <!-- Card -->
          <div
            class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-2xl"
          >
            <!-- Poster -->
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

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <!-- Title -->
                <h3 class="text-white font-bold text-sm line-clamp-2 mb-2">
                  {{ item.title || item.name }}
                </h3>

                <!-- Meta -->
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-green-500 font-bold"
                    >{{ getMatch(item) }}%</span
                  >
                  <span class="text-gray-400">{{ getYear(item) }}</span>
                  <span
                    class="px-1.5 py-0.5 bg-white/20 rounded text-gray-300 capitalize"
                  >
                    {{ item.media_type }}
                  </span>
                </div>

                <!-- Buttons -->
                <div class="flex items-center gap-2 mt-3">
                  <button
                    class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                  >
                    <Play class="w-3 h-3 fill-current" />
                    Play
                  </button>
                  <button
                    @click="handleRemove($event, item.id)"
                    class="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    title="Remove from List"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Type Badge -->
            <div
              class="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium capitalize"
              :class="
                item.media_type === 'movie'
                  ? 'bg-netflix-red/80 text-white'
                  : 'bg-max-purple/80 text-white'
              "
            >
              {{ item.media_type }}
            </div>

            <!-- Rating Badge -->
            <div
              v-if="item.vote_average"
              class="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white"
            >
              <Star class="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {{ item.vote_average.toFixed(1) }}
            </div>
          </div>

          <!-- Title (Mobile) -->
          <h3
            class="md:hidden text-white text-sm font-medium mt-2 line-clamp-1"
          >
            {{ item.title || item.name }}
          </h3>
        </div>
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
