<script setup lang="ts">
import RankedCard from "./RankedCard.vue";

defineProps<{
  title: string;
  items: any[];
}>();

const emit = defineEmits(["select"]);
</script>

<template>
  <div class="py-4">
    <!-- Title -->
    <h2 class="text-white text-lg md:text-2xl font-bold mb-4 px-4 md:px-12">
      {{ title }}
    </h2>

    <!-- Scrollable Row -->
    <div
      class="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-12 pb-4 scrollbar-hide"
      style="padding-left: 3rem"
    >
      <RankedCard
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :rank="index + 1"
        @click="$emit('select', item)"
      />
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
