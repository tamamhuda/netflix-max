<script setup lang="ts">
import { onMounted } from "vue";

const authStore = useAuthStore();

// Initialize auth from localStorage on app load
onMounted(() => {
  authStore.init();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
