<script setup lang="ts">
defineProps<{
  brand: string;
}>();

const brandStyles: Record<string, string> = {
  HBO: "bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-300 border-purple-500/30",
  DC: "bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-300 border-blue-500/30",
  WB: "bg-gradient-to-r from-amber-600/20 to-amber-500/20 text-amber-300 border-amber-500/30",
  Netflix:
    "bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-300 border-red-500/30",
};
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-semibold border backdrop-blur-sm"
    :class="
      brandStyles[brand] || 'bg-gray-600/20 text-gray-300 border-gray-500/30'
    "
  >
    {{ brand }}
  </span>
</template>
