<script setup lang="ts">
defineProps<{
  item: any;
  rank: number;
}>();

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const getPosterUrl = (path: string | null) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/w342${path}`;
};
</script>

<template>
  <div class="relative flex-shrink-0 cursor-pointer group pl-8 md:pl-12">
    <!-- Poster -->
    <div
      class="relative w-24 md:w-28 aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105"
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
        class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center"
      >
        <span class="text-gray-500 text-4xl font-bold">{{ rank }}</span>
      </div>
    </div>

    <!-- Rank Number (very large outlined) -->
    <div
      class="absolute left-0 bottom-0 font-black leading-none select-none pointer-events-none rank-number"
    >
      {{ rank }}
    </div>
  </div>
</template>

<style scoped>
.rank-number {
  font-size: 8rem;
  font-weight: 700;
  -webkit-text-stroke: 4px rgba(255, 255, 255, 0.9);
  -webkit-text-fill-color: transparent;
  text-shadow: 4px 4px 20px rgba(0, 0, 0, 0.8);
}

@media (min-width: 768px) {
  .rank-number {
    font-size: 10rem;
    font-weight: 700;
    -webkit-text-stroke: 5px rgba(255, 255, 255, 0.9);
  }
}
</style>
