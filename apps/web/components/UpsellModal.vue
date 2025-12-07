<script setup lang="ts">
import { Crown, Check, Sparkles } from "lucide-vue-next";
import Modal from "./Modal.vue";
import { useAuthStore } from "~/stores/auth";
import { ref, onMounted } from "vue";

const emit = defineEmits(["close"]);
const auth = useAuthStore();

const itemsVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    itemsVisible.value = true;
  }, 300);
});

const handleUpgrade = () => {
  auth.setPlan("max");
  emit("close");
};

const benefits = [
  "All HBO Original series and movies",
  "Complete DC Universe content",
  "Warner Bros theatrical releases",
];
</script>

<template>
  <Modal @close="$emit('close')">
    <div
      class="bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-2xl max-w-md w-full p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden mx-4"
    >
      <!-- Background glow -->
      <div
        class="absolute -top-20 -right-20 w-40 h-40 bg-max-purple/20 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"
      />

      <!-- Crown Icon -->
      <div class="relative flex items-center justify-center mb-6">
        <div
          class="absolute w-20 h-20 bg-max-purple/20 rounded-full blur-xl animate-pulse"
        />
        <div
          class="relative p-4 bg-gradient-to-br from-max-purple to-purple-700 rounded-2xl shadow-lg shadow-max-purple/30"
        >
          <Crown class="w-8 h-8 text-white" />
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-white text-xl md:text-2xl font-bold mb-2 text-center">
        Upgrade to Netflix Max
      </h2>

      <p class="text-gray-400 mb-6 text-center text-sm md:text-base">
        Unlock premium content from HBO, DC, and Warner Bros.
      </p>

      <!-- Benefits -->
      <div class="space-y-3 mb-6">
        <div
          v-for="(benefit, index) in benefits"
          :key="benefit"
          class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300"
          :class="
            itemsVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4'
          "
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div class="p-1.5 rounded-lg bg-max-purple/20">
            <Check class="w-4 h-4 text-max-purple" />
          </div>
          <span class="text-gray-300 text-sm">{{ benefit }}</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="space-y-3">
        <button
          @click="handleUpgrade"
          class="w-full py-3 px-6 bg-gradient-to-r from-max-purple to-purple-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-max-purple/30 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Sparkles class="w-4 h-4" />
          Upgrade Now
        </button>
        <button
          @click="$emit('close')"
          class="w-full py-3 px-6 bg-white/5 text-gray-400 font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </Modal>
</template>
