<script setup lang="ts">
import { Lock } from "lucide-vue-next";
import BrandBadge from "./BrandBadge.vue";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

defineProps<{
  title: {
    id: number;
    title?: string;
    name?: string;
    brand?: string;
    poster_path?: string | null;
    isMax?: boolean;
  };
  locked?: boolean;
  index?: number;
}>();

defineEmits(["click"]);

const getImageUrl = (posterPath: string | null | undefined): string | null => {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
};

const getDisplayTitle = (item: any): string => {
  return item.title || item.name || "Untitled";
};

const getMatchScore = (item: any): number => {
  return Math.round((item.vote_average || 8) * 10);
};

const getYear = (item: any): string => {
  return (
    item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || ""
  );
};
</script>

<template>
  <div
    @click="$emit('click')"
    class="group relative flex-shrink-0 w-32 h-48 md:w-44 md:h-64 rounded-xl cursor-pointer overflow-hidden transition-all duration-400 ease-out hover:scale-105 hover:z-20"
    :style="{ animationDelay: `${(index || 0) * 50}ms` }"
  >
    <!-- Background with gradient (fallback) -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"
    />

    <!-- Poster Image -->
    <img
      v-if="getImageUrl(title.poster_path)"
      :src="getImageUrl(title.poster_path)!"
      :alt="getDisplayTitle(title)"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
      loading="lazy"
    />

    <!-- Fallback Icon -->
    <div
      v-else
      class="flex items-center justify-center h-full text-4xl md:text-6xl transition-transform duration-400 group-hover:scale-110"
    >
      🎬
    </div>

    <!-- Glow effect on hover -->
    <div
      class="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10 blur-xl"
      :class="
        locked
          ? 'bg-gray-600/30'
          : title.brand === 'netflix'
            ? 'bg-netflix-red/30'
            : 'bg-max-purple/30'
      "
    />

    <!-- Border glow -->
    <div
      class="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/20 transition-all duration-300"
    />

    <!-- Lock Overlay -->
    <div
      v-if="locked"
      class="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300"
    >
      <div class="p-3 rounded-full bg-white/10 backdrop-blur-sm">
        <Lock class="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
    </div>

    <!-- Info Overlay -->
    <div
      class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300"
    >
      <div class="text-white text-xs md:text-sm font-semibold truncate mb-1">
        {{ getDisplayTitle(title) }}
      </div>
      <div class="flex items-center gap-2 text-[10px] md:text-xs mb-1">
        <span class="text-green-500 font-bold"
          >{{ getMatchScore(title) }}% Match</span
        >
        <span class="text-gray-400">{{ getYear(title) }}</span>
      </div>
      <BrandBadge
        v-if="title.brand"
        :brand="title.brand"
        class="scale-90 origin-left"
      />
    </div>

    <!-- Shimmer effect on hover -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl"
    >
      <div
        class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  </div>
</template>
