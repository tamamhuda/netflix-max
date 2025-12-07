<script setup lang="ts">
import { X } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const emit = defineEmits(["close"]);

const isVisible = ref(false);
const contentVisible = ref(false);

onMounted(() => {
  // Stagger the animations
  setTimeout(() => {
    isVisible.value = true;
  }, 10);
  setTimeout(() => {
    contentVisible.value = true;
  }, 100);
});

const handleClose = () => {
  contentVisible.value = false;
  isVisible.value = false;
  setTimeout(() => {
    emit("close");
  }, 200);
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        :class="isVisible ? 'opacity-100' : 'opacity-0'"
      />

      <!-- Content Container -->
      <div
        class="relative z-10 transition-all duration-300 ease-out"
        :class="contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
