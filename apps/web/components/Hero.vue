<script setup lang="ts">
import {
  Play,
  Info,
  Crown,
  Volume2,
  VolumeX,
  Plus,
  Check,
} from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";
import { useContentStore } from "~/stores/content";
import { useMyList } from "~/composables/useMyList";
import { onMounted, ref, computed, watch } from "vue";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const auth = useAuthStore();
const contentStore = useContentStore();
const { isInList, toggleInList } = useMyList();

// My List state for featured content
const isInMyList = computed(() => {
  if (!featuredContent.value) return false;
  return isInList(featuredContent.value.id);
});

const handleToggleMyList = () => {
  if (!featuredContent.value) return;
  toggleInList({
    ...featuredContent.value,
    media_type:
      featuredContent.value.media_type ||
      (featuredContent.value.title ? "movie" : "tv"),
  });
};

const isVisible = ref(false);
const showTrailer = ref(false);
const isMuted = ref(true);
const featuredContent = ref<any>(null);
const trailerKey = ref<string | null>(null);

// Get featured content from trending
const getFeaturedContent = computed(() => {
  const trending = contentStore.trending;
  return (
    trending.find((item: any) => item.backdrop_path) || trending[0] || null
  );
});

const backdropUrl = computed(() => {
  if (!featuredContent.value?.backdrop_path) return null;
  return `${TMDB_IMAGE_BASE}/original${featuredContent.value.backdrop_path}`;
});

const youtubeEmbedUrl = computed(() => {
  if (!trailerKey.value) return null;
  return `https://www.youtube.com/embed/${trailerKey.value}?autoplay=1&mute=${isMuted.value ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey.value}&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`;
});

const displayTitle = computed(() => {
  return (
    featuredContent.value?.title ||
    featuredContent.value?.name ||
    "House of the Dragon"
  );
});

const displayOverview = computed(() => {
  return (
    featuredContent.value?.overview ||
    "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke."
  );
});

onMounted(async () => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

// Watch for content changes
watch(
  getFeaturedContent,
  async (newContent) => {
    if (newContent) {
      featuredContent.value = newContent;

      const mediaType: "movie" | "tv" =
        newContent.media_type === "movie" || newContent.media_type === "tv"
          ? newContent.media_type
          : newContent.title
            ? "movie"
            : "tv";
      const details = await contentStore.fetchContentDetails(
        newContent.id,
        mediaType
      );

      if (details?.videos?.results) {
        const trailer =
          details.videos.results.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          ) || details.videos.results.find((v: any) => v.site === "YouTube");

        trailerKey.value = trailer?.key || null;

        if (trailerKey.value) {
          setTimeout(() => {
            showTrailer.value = true;
          }, 3000);
        }
      }
    }
  },
  { immediate: true }
);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};
</script>

<template>
  <div class="relative h-[65vh] md:h-[75vh] overflow-hidden">
    <!-- Background Trailer Video -->
    <div
      v-if="showTrailer && youtubeEmbedUrl"
      class="absolute inset-0 overflow-hidden"
      style="z-index: 1"
    >
      <div class="absolute inset-[-100px] md:inset-[-150px]">
        <iframe
          :key="isMuted"
          :src="youtubeEmbedUrl"
          class="w-full h-full pointer-events-none"
          style="transform: scale(1.5); transform-origin: center"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
          "
        />
      </div>
    </div>

    <!-- Backdrop Image (fallback or before trailer loads) -->
    <div v-else class="absolute inset-0" style="z-index: 1">
      <img
        v-if="backdropUrl"
        :src="backdropUrl"
        :alt="displayTitle"
        class="w-full h-full object-cover object-center"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-max-purple via-purple-900 via-40% to-black animated-gradient"
        style="background-size: 200% 200%"
      />
    </div>

    <!-- Subtle Pattern Overlay -->
    <div
      class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"
      style="z-index: 2"
    />

    <!-- Gradient Overlays -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/60 to-transparent"
      style="z-index: 3"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"
      style="z-index: 3"
    />

    <!-- Content -->
    <div
      class="relative h-full flex items-center px-4 md:px-12 pb-24"
      style="z-index: 10"
      :class="isVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="max-w-2xl space-y-4 md:space-y-6">
        <!-- Max Badge -->
        <div
          v-if="auth.hasMaxAccess"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-max-purple/30 to-purple-600/30 border border-max-purple/40 backdrop-blur-sm animate-fade-in"
        >
          <Crown class="w-4 h-4 text-max-purple" />
          <span class="text-white text-sm font-semibold tracking-wide"
            >NETFLIX MAX</span
          >
        </div>

        <!-- Title -->
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg"
          :class="isVisible ? 'animate-fade-in-up' : 'opacity-0'"
        >
          {{ displayTitle }}
        </h1>

        <!-- Description -->
        <p
          class="text-gray-300 text-sm md:text-lg max-w-xl leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow-md"
          :class="isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'"
        >
          {{ displayOverview }}
        </p>

        <!-- Actions -->
        <div
          class="flex flex-wrap gap-3 pt-2"
          :class="isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'"
        >
          <button
            class="group flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Play class="w-5 h-5 fill-current" />
            Play
          </button>
          <button
            @click="handleToggleMyList"
            class="group flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all duration-300"
            :class="
              isInMyList
                ? 'bg-green-600/30 text-green-400 border border-green-500/50 hover:bg-green-600/40'
                : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
            "
          >
            <Check v-if="isInMyList" class="w-5 h-5" />
            <Plus v-else class="w-5 h-5" />
            {{ isInMyList ? "In My List" : "My List" }}
          </button>
          <button
            class="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <Info class="w-5 h-5" />
            More Info
          </button>
        </div>
      </div>
    </div>

    <!-- Mute Toggle (when trailer playing) -->
    <button
      v-if="showTrailer && trailerKey"
      @click="toggleMute"
      class="absolute right-4 md:right-12 p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white hover:bg-black/80 transition-all"
      style="z-index: 50; bottom: 8rem"
    >
      <Volume2 v-if="!isMuted" class="w-5 h-5" />
      <VolumeX v-else class="w-5 h-5" />
    </button>

    <!-- Bottom Fade -->
    <div
      class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-dark to-transparent"
      style="z-index: 4"
    />
  </div>
</template>
