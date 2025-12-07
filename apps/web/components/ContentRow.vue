<script setup lang="ts">
import ContentCard from "./ContentCard.vue";
import { onMounted, ref } from "vue";

const props = defineProps<{
  title: string;
  items: any[];
  locked?: boolean;
}>();

defineEmits(["select"]);

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <div
    class="mb-8 md:mb-10 transition-all duration-500"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
  >
    <!-- Section Title -->
    <div class="flex items-center justify-between px-4 md:px-12 mb-4">
      <h2
        class="text-white text-lg md:text-xl font-bold tracking-tight flex items-center gap-2"
      >
        {{ title }}
        <span v-if="locked" class="text-xs text-gray-500 font-normal"
          >(Upgrade required)</span
        >
      </h2>
      <button
        class="text-gray-400 text-sm hover:text-white transition-colors duration-200 hidden md:block"
      >
        View All →
      </button>
    </div>

    <!-- Scrollable Row with Fade Edges -->
    <div class="relative">
      <!-- Left fade -->
      <div
        class="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-netflix-dark to-transparent z-10 pointer-events-none"
      />

      <!-- Content -->
      <div
        class="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-12 pt-4 pb-4 scrollbar-hide scroll-smooth"
      >
        <ContentCard
          v-for="(item, index) in items"
          :key="item.id"
          :title="item"
          :locked="locked"
          :index="index"
          @click="$emit('select', item)"
        />
      </div>

      <!-- Right fade -->
      <div
        class="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-netflix-dark to-transparent z-10 pointer-events-none"
      />
    </div>
  </div>
</template>
