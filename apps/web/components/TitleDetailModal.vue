<script setup lang="ts">
import {
  Play,
  Plus,
  Check,
  X,
  Star,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-vue-next";
import Modal from "./Modal.vue";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useContentStore } from "~/stores/content";
import { useAuthStore } from "~/stores/auth";
import { useMyList } from "~/composables/useMyList";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const props = defineProps<{
  title: any;
}>();

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const contentStore = useContentStore();
const { isInList, toggleInList } = useMyList();

// My List state
const isInMyList = computed(() => isInList(props.title.id));

const handleToggleMyList = () => {
  toggleInList({
    ...props.title,
    media_type: props.title.media_type || (props.title.title ? "movie" : "tv"),
  });
};

const contentVisible = ref(false);
const isLoadingDetails = ref(false);
const contentDetails = ref<any>(null);
const showTrailer = ref(false);
const isMuted = ref(true);

// Fullscreen state
const trailerContainer = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);
const showControls = ref(true);
let controlsTimeout: ReturnType<typeof setTimeout> | null = null;

// Get trailer key from videos
const trailerKey = computed(() => {
  const videos = contentDetails.value?.videos?.results || [];
  const trailer =
    videos.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ||
    videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
    videos.find((v: any) => v.site === "YouTube");
  return trailer?.key || null;
});

// YouTube URL with mute state and loop
const youtubeEmbedUrl = computed(() => {
  if (!trailerKey.value) return null;
  const muteParam = isMuted.value ? 1 : 0;
  return `https://www.youtube.com/embed/${trailerKey.value}?autoplay=1&mute=${muteParam}&loop=1&playlist=${trailerKey.value}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&playsinline=1`;
});

// Movie details
const displayTitle = computed(
  () => props.title.title || props.title.name || ""
);
const displayYear = computed(
  () =>
    props.title.release_date?.slice(0, 4) ||
    props.title.first_air_date?.slice(0, 4) ||
    ""
);
const displayMatch = computed(() =>
  Math.round((props.title.vote_average || 8) * 10)
);

onMounted(async () => {
  setTimeout(() => {
    contentVisible.value = true;
  }, 200);

  if (props.title.id) {
    isLoadingDetails.value = true;
    const mediaType =
      props.title.media_type || (props.title.title ? "movie" : "tv");
    contentDetails.value = await contentStore.fetchContentDetails(
      props.title.id,
      mediaType as "movie" | "tv"
    );
    isLoadingDetails.value = false;
  }

  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  if (controlsTimeout) clearTimeout(controlsTimeout);
});

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

const getBackdropUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w1280${path}`;
};

const getPosterUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w500${path}`;
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const enterFullscreen = async () => {
  if (trailerContainer.value && document.fullscreenEnabled) {
    try {
      await trailerContainer.value.requestFullscreen();
      isFullscreen.value = true;
    } catch (err) {
      console.log("Fullscreen not available");
    }
  }
};

const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
};

const handlePlay = () => {
  if (trailerKey.value) {
    showTrailer.value = true;

    // Auto fullscreen after 3 seconds
    setTimeout(() => {
      if (showTrailer.value) {
        enterFullscreen();
      }
    }, 3000);
  }
};

const stopTrailer = () => {
  showTrailer.value = false;
  if (isFullscreen.value) {
    exitFullscreen();
  }
};

// Mouse movement for controls visibility
const handleMouseMove = () => {
  showControls.value = true;
  if (controlsTimeout) clearTimeout(controlsTimeout);

  controlsTimeout = setTimeout(() => {
    if (isFullscreen.value) {
      showControls.value = false;
    }
  }, 3000);
};

const handleMouseLeave = () => {
  if (isFullscreen.value) {
    showControls.value = false;
  }
};
</script>

<template>
  <Modal @close="$emit('close')">
    <div
      class="bg-gray-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin"
    >
      <!-- Hero Image Area / Trailer -->
      <div class="relative h-48 md:h-80 overflow-hidden">
        <!-- YouTube Trailer Container (fullscreen capable) -->
        <div
          v-if="showTrailer && trailerKey"
          ref="trailerContainer"
          class="absolute inset-0 bg-black"
          :class="isFullscreen ? 'fixed inset-0 z-[9999]' : ''"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <!-- Iframe wrapper -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              :class="
                isFullscreen
                  ? 'absolute inset-[-30px]'
                  : 'absolute inset-[-80px] md:inset-[-120px]'
              "
            >
              <iframe
                :key="`${trailerKey}-${isMuted}`"
                :src="youtubeEmbedUrl!"
                class="w-full h-full"
                :style="
                  isFullscreen
                    ? 'transform: scale(1.1); transform-origin: center'
                    : 'transform: scale(1.4); transform-origin: center'
                "
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

          <!-- Gradient overlays -->

          <!-- Additional side gradient for non-fullscreen (banner effect) -->
          <div
            v-if="!isFullscreen"
            class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none"
          />

          <!-- Fullscreen Controls Overlay -->
          <div
            class="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            :class="showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'"
          >
            <!-- Top Bar - Title Info -->
            <div
              class="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-white text-xl md:text-3xl font-bold">
                    {{ displayTitle }}
                  </h1>
                  <div class="flex items-center gap-3 mt-1 text-sm">
                    <span class="text-green-500 font-bold"
                      >{{ displayMatch }}% Match</span
                    >
                    <span class="text-gray-400">{{ displayYear }}</span>
                    <span
                      v-if="title.brand"
                      class="px-2 py-0.5 rounded bg-max-purple/30 text-max-purple text-xs font-medium uppercase"
                    >
                      {{ title.brand }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Bar - Controls (inside overlay for fullscreen) -->
            <div
              class="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent pointer-events-auto"
            >
              <div
                class="items-center justify-between"
                :class="isFullscreen ? 'flex' : 'hidden'"
              >
                <!-- Left: Volume -->
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="toggleMute"
                    class="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all border border-white/40"
                  >
                    <Volume2 v-if="!isMuted" class="w-5 h-5" />
                    <VolumeX v-else class="w-5 h-5" />
                  </button>
                  <span class="text-white text-sm hidden md:inline">{{
                    isMuted ? "Unmute" : "Mute"
                  }}</span>
                </div>

                <!-- Center: Playing info -->
                <p class="text-gray-400 text-sm hidden md:block">
                  Playing Trailer
                </p>

                <!-- Right: Fullscreen + Stop -->
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="toggleFullscreen"
                    class="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all border border-white/40"
                  >
                    <Minimize v-if="isFullscreen" class="w-5 h-5" />
                    <Maximize v-else class="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    @click="stopTrailer"
                    class="px-4 py-3 rounded-lg bg-netflix-red text-white text-sm font-bold hover:bg-red-700 transition-all"
                  >
                    ✕ Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Control Buttons (direct children of hero area, NOT inside trailer container) -->
        <div
          v-if="showTrailer && trailerKey"
          class="absolute bottom-4 left-4 right-4 z-[100] flex items-center justify-between"
          :class="isFullscreen ? 'fixed bottom-8 left-8 right-8 z-[10000]' : ''"
        >
          <!-- Left: Volume -->
          <button
            type="button"
            @click="toggleMute"
            class="p-3 rounded-full bg-black border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all"
          >
            <Volume2 v-if="!isMuted" class="w-5 h-5" />
            <VolumeX v-else class="w-5 h-5" />
          </button>

          <!-- Center: Title (fullscreen only) -->
          <div v-if="isFullscreen" class="text-center">
            <h3 class="text-white font-bold text-lg">{{ displayTitle }}</h3>
            <p class="text-gray-400 text-sm">
              {{ displayMatch }}% Match · {{ displayYear }}
            </p>
          </div>

          <!-- Right: Fullscreen + Stop -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="toggleFullscreen"
              class="p-3 rounded-full bg-black border-2 border-white/60 text-white hover:bg-white hover:text-black transition-all"
            >
              <Minimize v-if="isFullscreen" class="w-5 h-5" />
              <Maximize v-else class="w-5 h-5" />
            </button>
            <button
              type="button"
              @click="stopTrailer"
              class="px-4 py-3 rounded-lg bg-netflix-red border-2 border-netflix-red text-white text-sm font-bold hover:bg-red-700 transition-all"
            >
              ✕ Stop
            </button>
          </div>
        </div>

        <!-- Backdrop Image (when not playing trailer) -->
        <template v-else>
          <img
            v-if="getBackdropUrl(title.backdrop_path)"
            :src="getBackdropUrl(title.backdrop_path)!"
            :alt="title.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-max-purple via-purple-900 to-blue-900"
          />

          <!-- Pattern overlay -->
          <div
            class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"
          />
        </template>

        <!-- Poster thumbnail -->
        <div
          v-if="getPosterUrl(title.poster_path) && !showTrailer"
          class="absolute left-6 bottom-6 w-24 md:w-32 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 hidden md:block transition-all duration-500"
          :class="
            contentVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          "
        >
          <img
            :src="getPosterUrl(title.poster_path)!"
            :alt="title.title"
            class="w-full h-auto"
          />
        </div>

        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200"
          style="z-index: 25"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Bottom gradient -->
        <div
          v-if="!showTrailer"
          class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"
        />
      </div>

      <!-- Content (hidden in fullscreen) -->
      <div
        v-if="!isFullscreen"
        class="relative p-5 md:p-8 md:pl-44 -mt-16 z-10 transition-all duration-500"
        :class="
          contentVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        "
      >
        <!-- Title & Badge -->
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <h2 class="text-white text-2xl md:text-4xl font-bold">
            {{ title.title || title.name }}
          </h2>
          <div
            v-if="title.isMax && authStore.hasMaxAccess"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-max-purple/30 to-purple-600/30 border border-max-purple/40 text-xs md:text-sm font-semibold text-white w-fit"
          >
            <Star class="w-3 h-3 text-max-purple" />
            Included with Max
          </div>
        </div>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-3 mb-5 text-sm">
          <span class="text-green-500 font-bold"
            >{{ displayMatch }}% Match</span
          >
          <span class="text-gray-400">{{ displayYear }}</span>
          <span
            class="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-xs font-medium"
          >
            {{ title.rating || "TV-MA" }}
          </span>
          <span
            class="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-xs font-medium"
          >
            HD
          </span>
          <span
            v-if="trailerKey"
            class="px-2 py-0.5 rounded bg-netflix-red/20 text-netflix-red text-xs font-medium"
          >
            Trailer Available
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mb-6">
          <button
            v-if="!showTrailer"
            @click="handlePlay"
            :disabled="isLoadingDetails || !trailerKey"
            class="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              v-if="isLoadingDetails"
              class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"
            />
            <Play v-else class="w-5 h-5 fill-current" />
            {{
              isLoadingDetails
                ? "Loading..."
                : trailerKey
                  ? "Play Trailer"
                  : "No Trailer"
            }}
          </button>
          <button
            v-else
            @click="stopTrailer"
            class="flex items-center gap-2 px-6 py-3 bg-netflix-red text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg"
          >
            <X class="w-5 h-5" />
            Stop Trailer
          </button>
          <button
            @click="handleToggleMyList"
            class="flex items-center gap-2 p-3 rounded-xl transition-all duration-300"
            :class="
              isInMyList
                ? 'bg-green-600/20 text-green-500 border border-green-500/40 hover:bg-green-600/30'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            "
            :title="isInMyList ? 'Remove from My List' : 'Add to My List'"
          >
            <Check v-if="isInMyList" class="w-5 h-5" />
            <Plus v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Description -->
        <p class="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
          {{ title.description || title.overview }}
        </p>
      </div>
    </div>
  </Modal>
</template>
