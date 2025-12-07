<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Plus } from "lucide-vue-next";

defineProps<{
  question: string;
}>();

const isOpen = ref(false);
const contentRef = ref<HTMLElement | null>(null);
const contentHeight = ref(0);

const toggle = async () => {
  if (!isOpen.value && contentRef.value) {
    // Measure content height before opening
    contentRef.value.style.height = "auto";
    await nextTick();
    contentHeight.value = contentRef.value.scrollHeight;
    contentRef.value.style.height = "0px";
  }
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="mb-3 group">
    <!-- Question Button -->
    <button
      @click="toggle"
      class="w-full flex items-center justify-between p-5 md:p-6 rounded-t-lg text-left transition-all duration-300"
      :class="[isOpen ? 'rounded-b-none' : 'rounded-b-lg hover:scale-[1.01]']"
      style="
        background: linear-gradient(
          135deg,
          rgba(229, 9, 20, 0.08) 20%,
          rgba(88, 34, 180, 0.2) 100%,
          rgba(45, 45, 45, 0.95) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.07);
      "
    >
      <span class="text-white text-base md:text-xl font-medium pr-4">{{
        question
      }}</span>
      <div
        class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
        :class="
          isOpen
            ? 'bg-gradient-to-br from-[#E50914] to-[#5822B4]'
            : 'bg-white/10'
        "
      >
        <Plus
          class="text-white w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ease-out"
          :class="{ 'rotate-45': isOpen }"
        />
      </div>
    </button>

    <!-- Answer Content with smooth animation -->
    <div
      ref="contentRef"
      class="overflow-hidden transition-all duration-300 ease-out"
      :style="{
        height: isOpen ? `${contentHeight}px` : '0px',
        opacity: isOpen ? 1 : 0,
      }"
    >
      <div
        class="p-5 md:p-6 text-gray-200 text-base md:text-lg leading-relaxed text-left rounded-b-lg"
        style="background: linear-gradient(180deg)"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
