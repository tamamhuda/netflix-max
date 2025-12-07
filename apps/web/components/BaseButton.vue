<script setup lang="ts">
import { type Component } from "vue";

defineProps<{
  variant?: "primary" | "secondary";
  icon?: Component;
}>();
</script>

<template>
  <button
    class="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 font-semibold rounded-lg transition-all duration-300"
    :class="[
      variant === 'secondary'
        ? 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30'
        : 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105',
    ]"
  >
    <component
      :is="icon"
      v-if="icon"
      class="w-4 h-4 md:w-5 md:h-5"
      :class="variant !== 'secondary' && 'fill-current'"
    />
    <slot />
  </button>
</template>
