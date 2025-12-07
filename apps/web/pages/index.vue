<script setup lang="ts">
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import FaqItem from "~/components/FaqItem.vue";

// Public page - redirect to home if authenticated
definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const email = ref("");
const pageReady = ref(false);
const trendingContent = ref<{ netflix: any[]; max: any[] }>({
  netflix: [],
  max: [],
});
const isLoadingTrending = ref(true);
const trendingScrollRef = ref<HTMLElement | null>(null);
const hboScrollRef = ref<HTMLElement | null>(null);

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

onMounted(async () => {
  if (authStore.isAuthenticated) {
    navigateTo("/home");
    return;
  }

  try {
    const config = useRuntimeConfig();
    const response = await $fetch<{ netflix: any[]; max: any[] }>(
      `${config.public.apiBase}/content/trending`
    );
    trendingContent.value = response;
  } catch (err) {
    console.error("Failed to fetch public trending:", err);
  } finally {
    isLoadingTrending.value = false;
  }

  setTimeout(() => {
    pageReady.value = true;
  }, 100);
});

const handleGetStarted = () => {
  if (email.value) {
    navigateTo(`/register?email=${encodeURIComponent(email.value)}`);
  } else {
    navigateTo("/register");
  }
};

const getPosterUrl = (path: string | null): string | undefined => {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE}/w500${path}`;
};

const handleTrendingClick = () => {
  navigateTo("/login");
};

const scrollTrending = (direction: "left" | "right") => {
  if (trendingScrollRef.value) {
    const scrollAmount = 320;
    trendingScrollRef.value.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

const scrollHbo = (direction: "left" | "right") => {
  if (hboScrollRef.value) {
    const scrollAmount = 320;
    hboScrollRef.value.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};

const faqs = [
  {
    question: "What is NetflixMax?",
    answer:
      "NetflixMax is a fictional demo project that explores the concept of Netflix bundling together with HBO Max.<br><br>This project is only for educational, creative, and UI/UX demonstration purposes. It is not an official service or partnership between Netflix and HBO.",
  },
  {
    question:
      "Is NetflixMax an official collaboration between Netflix and HBO Max?",
    answer:
      "No. NetflixMax is not official and is not affiliated with Netflix, HBO Max, Warner Bros. Discovery, or any real streaming provider.<br><br>All branding and references are used only to visualize how a combined streaming experience might look.",
  },
  {
    question: "Does NetflixMax offer real movies or shows?",
    answer:
      "No. NetflixMax does not stream real content. Any titles, images, or previews shown in the project are placeholders to simulate a combined Netflix + HBO Max experience.",
  },
  {
    question: "Why was NetflixMax created?",
    answer:
      "This project was created to demonstrate UI/UX design skills, authentication flow, and conceptual product design.<br><br>It imagines how a unified streaming service might work if Netflix and HBO Max were bundled together.",
  },
  {
    question: "Can I sign up or sign in to NetflixMax?",
    answer:
      "Yes, NetflixMax allows users to sign up and sign in within the demo.<br><br>However, these accounts are for demonstration only. They are not connected to Netflix or HBO Max, and no subscription or real payment is required.",
  },
  {
    question: "Does NetflixMax offer real subscriptions or billing?",
    answer:
      "No. NetflixMax does not provide paid subscriptions, billing, or real account services. All account actions inside the platform are part of the demo experience only.",
  },
  {
    question: "Is NetflixMax suitable for kids?",
    answer:
      "NetflixMax does not provide real content, but some demo categories may display placeholder artwork. Since this is only a design concept, parental controls are not included.",
  },
];
</script>

<template>
  <div class="min-h-screen bg-black overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative h-[48rem] lg:h-[700px] xl:h-[800px]">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/30c8b9f4-3db9-4b3b-a1ee-8fa56531b712/web/ID-en-20251201-TRIFECTA-perspective_e45907a2-0c34-4a8e-bb7c-6a14e8ee479f_large.jpg"
          alt="Background"
          class="w-full h-full object-cover opacity-50"
          onerror="this.style.display = 'none'"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80"
        />
      </div>

      <!-- Header/Navbar -->
      <header
        class="relative z-30 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto"
      >
        <img
          src="/images/netflix-max.png"
          alt="Netflix Max"
          class="h-6 md:h-16 w-auto"
        />
        <div class="flex items-center gap-4">
          <button class="hidden sm:block text-white font-medium mr-4">
            English
          </button>
          <NuxtLink
            to="/login"
            class="px-4 py-1.5 bg-[#e50914] text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
          >
            Sign In
          </NuxtLink>
        </div>
      </header>

      <!-- Hero Content -->
      <div
        class="relative z-20 flex flex-col items-center justify-center text-center px-6 h-full -mt-20"
        :class="pageReady ? 'opacity-100' : 'opacity-0'"
        style="transition: opacity 0.5s ease-out"
      >
        <div class="max-w-4xl mx-auto space-y-4">
          <h1
            class="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight"
          >
            Unlimited movies, TV shows, and more
          </h1>
          <p class="text-sm font-semibold text-white">
            Watch anywhere. Cancel anytime.
          </p>
          <p class="text-sm font-bold text-white pt-4">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>

          <!-- Email Form -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-4xl mx-auto"
          >
            <div class="relative w-full sm:w-8/12 md:w-96 group">
              <input
                v-model="email"
                type="email"
                placeholder=" "
                id="email_hero"
                class="peer w-full px-6 pt-6 pb-2 bg-black/40 border border-gray-400 rounded text-white text-base focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all h-14 md:h-16"
              />
              <label
                for="email_hero"
                class="absolute left-6 top-4 text-gray-300 text-base transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Email address
              </label>
            </div>
            <button
              @click="handleGetStarted"
              class="flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-[#e50914] text-white text-xl md:text-2xl font-bold rounded hover:bg-red-700 transition-colors group-hover:bg-red-700 h-14 md:h-16 mt-4 sm:mt-0 w-auto"
            >
              Get Started
              <ChevronRight class="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Container -->
    <div class="bg-black">
      <!-- Trending Now Section -->
      <section class="py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <h2 class="text-white text-xl md:text-2xl font-bold mb-6">
            Trending Now
          </h2>

          <!-- Horizontal Scroll Container -->
          <div class="relative group">
            <!-- Left Arrow -->
            <button
              @click="scrollTrending('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
            >
              <ChevronLeft class="w-6 h-6 text-white" />
            </button>

            <!-- Scroll Area -->
            <div
              ref="trendingScrollRef"
              class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-4 -mt-4"
              style="scrollbar-width: none; -ms-overflow-style: none"
            >
              <div
                v-for="(item, index) in trendingContent.netflix"
                :key="item.id"
                @click="handleTrendingClick"
                class="flex-shrink-0 relative cursor-pointer group/card"
                style="width: 220px; height: 250px"
              >
                <!-- Poster Image -->
                <div
                  class="absolute top-0 right-0 rounded-lg overflow-hidden transition-transform duration-300 group-hover/card:scale-105"
                  style="width: 190px; height: 250px"
                >
                  <img
                    v-if="getPosterUrl(item.poster_path)"
                    :src="getPosterUrl(item.poster_path)"
                    :alt="item.title || item.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gray-800" />
                </div>

                <!-- Large Rank Number (in front of poster, bottom-left) -->
                <div
                  class="absolute bottom-8 left-3 z-20 leading-none select-none transition-transform duration-300 group-hover/card:scale-105"
                  :style="{
                    fontSize: '100px',
                    fontWeight: 700,
                    fontFamily: '\'Arial Black\', Helvetica, sans-serif',
                    color: '#000',
                    WebkitTextStroke: '3px #dedede',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    lineHeight: 0.8,
                  }"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>

            <!-- Right Arrow -->
            <button
              @click="scrollTrending('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-4"
            >
              <ChevronRight class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      <!-- Trending on HBO Section -->
      <section class="py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <h2 class="text-white text-xl md:text-2xl font-bold mb-6">
            Trending on HBO
          </h2>

          <!-- Horizontal Scroll Container -->
          <div class="relative group">
            <!-- Left Arrow -->
            <button
              @click="scrollHbo('left')"
              class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
            >
              <ChevronLeft class="w-6 h-6 text-white" />
            </button>

            <!-- Scroll Area -->
            <div
              ref="hboScrollRef"
              class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-4 -mt-4"
              style="scrollbar-width: none; -ms-overflow-style: none"
            >
              <div
                v-for="(item, index) in trendingContent.max"
                :key="item.id"
                @click="handleTrendingClick"
                class="flex-shrink-0 relative cursor-pointer group/card"
                style="width: 220px; height: 250px"
              >
                <!-- Poster Image -->
                <div
                  class="absolute top-0 right-0 rounded-lg overflow-hidden transition-transform duration-300 group-hover/card:scale-105"
                  style="width: 190px; height: 250px"
                >
                  <img
                    v-if="getPosterUrl(item.poster_path)"
                    :src="getPosterUrl(item.poster_path)"
                    :alt="item.title || item.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gray-800" />
                </div>

                <!-- Large Rank Number (in front of poster, bottom-left) -->
                <div
                  class="absolute bottom-8 left-3 z-20 leading-none select-none transition-transform duration-300 group-hover/card:scale-105"
                  :style="{
                    fontSize: '100px',
                    fontWeight: 700,
                    fontFamily: '\'Arial Black\', Helvetica, sans-serif',
                    color: '#000',
                    WebkitTextStroke: '3px #dedede',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    lineHeight: 0.8,
                  }"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>

            <!-- Right Arrow -->
            <button
              @click="scrollHbo('right')"
              class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-4"
            >
              <ChevronRight class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      <!-- More Reasons to Join Section -->
      <section class="py-16 md:py-24">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
          <h2 class="text-white text-xl md:text-2xl font-bold mb-6">
            More Reasons to Join
          </h2>

          <!-- 4-column Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card 1: Enjoy on your TV -->
            <div
              class="group relative rounded-2xl p-5 lg:p-6 min-h-[200px] lg:min-h-[240px] flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style="
                background: linear-gradient(
                  135deg,
                  rgba(229, 9, 20, 0.15) 0%,
                  rgba(88, 34, 180, 0.25) 50%,
                  rgba(20, 20, 30, 0.9) 100%
                );
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
              "
            >
              <!-- Decorative gradient orb -->
              <div
                class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#E50914]/30 to-[#5822B4]/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"
              />
              <div>
                <h3
                  class="text-white text-lg lg:text-xl font-bold mb-2 relative z-10"
                >
                  Enjoy on your TV
                </h3>
                <p class="text-gray-300 text-sm lg:text-base relative z-10">
                  Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
                  Blu-ray players, and more.
                </p>
              </div>
              <div class="flex justify-end mt-4 relative z-10">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 72 72"
                  fill="none"
                  class="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <g id="television-core-small">
                    <path
                      id="Vector"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M37.2 53.3992C37.2 52.7365 36.6628 52.1992 36 52.1992H34.8C34.1373 52.1992 33.6 52.7365 33.6 53.3992V56.2636C33.6 56.9129 33.0834 57.4433 32.4347 57.4739C30.3013 57.5744 28.1719 57.7834 26.0546 58.1011L19.444 59.0926C18.2692 59.2688 17.4 60.2782 17.4 61.4662V62.0992C17.4 62.4304 17.6686 62.6992 18 62.6992H52.8C53.1314 62.6992 53.4 62.4304 53.4 62.0992V61.4662C53.4 60.2782 52.5309 59.2688 51.3561 59.0926L44.7454 58.1011C42.6282 57.7834 40.4987 57.5744 38.3653 57.4739C37.7167 57.4433 37.2 56.9129 37.2 56.2636V53.3992Z"
                      fill="url(#paint0_radial_5179_1308)"
                    ></path>
                    <path
                      id="Vector_2"
                      d="M18.6 60.7388C18.6 60.2306 18.9587 59.796 19.4602 59.711C22.0196 59.2775 29.7585 58.0508 35.4 58.0508C41.0415 58.0508 48.7804 59.2775 51.3398 59.711C51.8412 59.796 52.2 60.2306 52.2 60.7388C52.2 60.902 52.0575 61.0268 51.8967 61.0004C50.1219 60.707 40.9704 59.2409 35.4 59.2409C29.8295 59.2409 20.678 60.707 18.9033 61.0004C18.7425 61.0268 18.6 60.902 18.6 60.7388Z"
                      fill="url(#paint1_radial_5179_1308)"
                    ></path>
                    <path
                      id="Vector_3"
                      d="M63 12H8.99995C8.00584 12 7.19995 12.8059 7.19995 13.8V51.6C7.19995 52.5941 8.00584 53.4 8.99995 53.4H63C63.9941 53.4 64.8 52.5941 64.8 51.6V13.8C64.8 12.8059 63.9941 12 63 12Z"
                      fill="url(#paint2_linear_5179_1308)"
                    ></path>
                    <path
                      id="Vector_4"
                      d="M63 12H8.99995C8.00584 12 7.19995 12.8059 7.19995 13.8V51.6C7.19995 52.5941 8.00584 53.4 8.99995 53.4H63C63.9941 53.4 64.8 52.5941 64.8 51.6V13.8C64.8 12.8059 63.9941 12 63 12Z"
                      fill="url(#paint3_radial_5179_1308)"
                    ></path>
                    <path
                      id="Vector_5"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.99995 12.6H63C63.663 12.6 64.2 13.1372 64.2 13.8V50.4H7.79995V13.8C7.79995 13.1372 8.33719 12.6 8.99995 12.6ZM7.19995 50.4V13.8C7.19995 12.8059 8.00581 12 8.99995 12H63C63.9942 12 64.8 12.8059 64.8 13.8V50.4V51.6C64.8 52.5941 63.9942 53.4 63 53.4H8.99995C8.00581 53.4 7.19995 52.5941 7.19995 51.6V50.4Z"
                      fill="url(#paint4_radial_5179_1308)"
                    ></path>
                    <path
                      id="Vector_6"
                      d="M35.4 52.8C36.3941 52.8 37.2 52.3971 37.2 51.9C37.2 51.4029 36.3941 51 35.4 51C34.4059 51 33.6 51.4029 33.6 51.9C33.6 52.3971 34.4059 52.8 35.4 52.8Z"
                      fill="url(#paint5_radial_5179_1308)"
                    ></path>
                  </g>
                  <defs>
                    <radialGradient
                      id="paint0_radial_5179_1308"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(50.3269 49.3723) rotate(118.526) scale(55.1579 46.2871)"
                    >
                      <stop stop-color="#802600"></stop>
                      <stop offset="0.333333" stop-color="#6F181D"></stop>
                      <stop offset="0.666667" stop-color="#5B1333"></stop>
                      <stop offset="1" stop-color="#391945"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint1_radial_5179_1308"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(48.1077 53.6128) rotate(158.116) scale(32.7275 42.219)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <linearGradient
                      id="paint2_linear_5179_1308"
                      x1="10.4727"
                      y1="14.9572"
                      x2="56.1755"
                      y2="51.4814"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#99161D"></stop>
                      <stop offset="0.245283" stop-color="#CA005B"></stop>
                      <stop offset="0.346698" stop-color="#FF479A"></stop>
                      <stop offset="0.46934" stop-color="#CC3CFF"></stop>
                      <stop offset="0.735849" stop-color="#BC1A22"></stop>
                      <stop offset="1" stop-color="#C94FF5"></stop>
                    </linearGradient>
                    <radialGradient
                      id="paint3_radial_5179_1308"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(38.6181 23.8286) rotate(90) scale(25.9571 25.8545)"
                    >
                      <stop stop-color="#1C0E20" stop-opacity="0"></stop>
                      <stop offset="1" stop-color="#1C0E20"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint4_radial_5179_1308"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(54 20.1938) rotate(144.293) scale(47.2897 44.8232)"
                    >
                      <stop stop-color="#EF7744"></stop>
                      <stop offset="0.333333" stop-color="#E50914"></stop>
                      <stop offset="0.666667" stop-color="#A70D53"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_5179_1308"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(36.525 51.3562) rotate(135) scale(4.58735)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                      <stop offset="0.666667" stop-color="#F89DC6"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <!-- Card 2: Download your shows -->
            <div
              class="group relative rounded-2xl p-5 lg:p-6 min-h-[200px] lg:min-h-[240px] flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style="
                background: linear-gradient(
                  135deg,
                  rgba(88, 34, 180, 0.2) 0%,
                  rgba(229, 9, 20, 0.15) 50%,
                  rgba(20, 20, 30, 0.9) 100%
                );
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
              "
            >
              <!-- Decorative gradient orb -->
              <div
                class="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-[#5822B4]/30 to-[#E50914]/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"
              />
              <div>
                <h3
                  class="text-white text-lg lg:text-xl font-bold mb-2 relative z-10"
                >
                  Download your shows to watch offline
                </h3>
                <p class="text-gray-300 text-sm lg:text-base relative z-10">
                  Save your favorites easily and always have something to watch.
                </p>
              </div>
              <div class="flex justify-end mt-4 relative z-10">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 72 72"
                  fill="none"
                  class="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <g id="download-core-small">
                    <path
                      id="Vector"
                      d="M36 70.2008C54.8882 70.2008 70.2001 54.8889 70.2001 36.0008C70.2001 17.1126 54.8882 1.80078 36 1.80078C17.1119 1.80078 1.80005 17.1126 1.80005 36.0008C1.80005 54.8889 17.1119 70.2008 36 70.2008Z"
                      fill="url(#paint0_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_2"
                      opacity="0.4"
                      d="M64.7658 36.195C65.5206 51.5916 53.7908 63.5824 38.5668 62.977C23.3428 62.3722 10.3893 49.4 9.63446 34.0034C8.87954 18.6068 20.6091 6.61594 35.8331 7.22116C51.0571 7.82638 64.0104 20.7984 64.7658 36.195Z"
                      fill="url(#paint1_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_3"
                      d="M62.3657 37.9958C63.1205 53.3924 51.3908 65.3832 36.1668 64.7778C20.9428 64.173 7.9893 51.2008 7.23444 35.8041C6.47952 20.4075 18.2091 8.41672 33.4331 9.02194C48.6571 9.62716 61.6103 22.5992 62.3657 37.9958Z"
                      fill="url(#paint2_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_4"
                      opacity="0.5"
                      d="M64.7658 36.195C65.5206 51.5916 53.7908 63.5824 38.5668 62.977C23.3428 62.3722 10.3893 49.4 9.63446 34.0034C8.87954 18.6068 20.6091 6.61594 35.8331 7.22116C51.0571 7.82638 64.0104 20.7984 64.7658 36.195Z"
                      fill="url(#paint3_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_5"
                      opacity="0.6"
                      d="M36.9 60.6C48.6636 60.6 58.2 51.0637 58.2 39.3C58.2 27.5363 48.6636 18 36.9 18C25.1363 18 15.6 27.5363 15.6 39.3C15.6 51.0637 25.1363 60.6 36.9 60.6Z"
                      fill="url(#paint4_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_6"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M39.0849 42.2727L46.3387 35.76L48.8945 38.5142L38.9118 47.477L37.8466 48.4333L36.6071 47.477L24.9899 38.5142L27.0434 35.76L35.4849 42.2727L33.6 21.6016H37.2L39.0849 42.2727Z"
                      fill="url(#paint5_radial_5179_7940)"
                    ></path>
                    <path
                      id="Vector_7"
                      opacity="0.4"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M61.6566 34.9618C61.7832 35.3893 62.391 35.3233 62.3694 34.878C61.6962 21.1369 50.1509 9.55975 36.5817 9.01957C34.4606 8.93515 32.4155 9.12541 30.4772 9.55909C30.0745 9.64915 30.1575 10.2082 30.5697 10.2246C45.0094 10.7979 57.6246 21.2971 61.6566 34.9618Z"
                      fill="url(#paint6_radial_5179_7940)"
                    ></path>
                  </g>
                  <defs>
                    <radialGradient
                      id="paint0_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(36.0001 36.1837) rotate(-90) scale(34.3829)"
                    >
                      <stop offset="0.782019" stop-color="#982DBE"></stop>
                      <stop
                        offset="0.906819"
                        stop-color="#B038DC"
                        stop-opacity="0.2"
                      ></stop>
                      <stop
                        offset="1"
                        stop-color="#E4A1FA"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint1_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(52.9937 20.0992) rotate(135) scale(49.9836)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                      <stop offset="0.666667" stop-color="#F89DC6"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint2_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(52.7999 19.6937) rotate(135) scale(53.1037)"
                    >
                      <stop stop-color="#FFA984"></stop>
                      <stop offset="0.333333" stop-color="#FF787F"></stop>
                      <stop offset="0.666667" stop-color="#F45FA2"></stop>
                      <stop offset="1" stop-color="#C44AF1"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint3_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(52.9937 20.0992) rotate(135) scale(49.9836)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                      <stop offset="0.666667" stop-color="#F89DC6"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint4_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(36.9 39.3) scale(21.3)"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(31.2 32.1016) rotate(39.5226) scale(15.5567)"
                    >
                      <stop stop-color="#EF7744"></stop>
                      <stop offset="0.2406" stop-color="#E50914"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint6_radial_5179_7940"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(50.7 21.3) rotate(-180) scale(30)"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <!-- Card 3: Watch everywhere -->
            <div
              class="group relative rounded-2xl p-5 lg:p-6 min-h-[200px] lg:min-h-[240px] flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style="
                background: linear-gradient(
                  135deg,
                  rgba(229, 9, 20, 0.2) 0%,
                  rgba(88, 34, 180, 0.3) 100%
                );
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
              "
            >
              <!-- Decorative gradient orb -->
              <div
                class="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-[#E50914]/25 to-[#5822B4]/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"
              />
              <div>
                <h3
                  class="text-white text-lg lg:text-xl font-bold mb-2 relative z-10"
                >
                  Watch everywhere
                </h3>
                <p class="text-gray-300 text-sm lg:text-base relative z-10">
                  Stream unlimited movies and TV shows on your phone, tablet,
                  laptop, and TV.
                </p>
              </div>
              <div class="flex justify-end mt-4 relative z-10">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 72 72"
                  fill="none"
                  class="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <g id="telescope-core-small">
                    <path
                      id="Vector"
                      d="M24.0492 36.6016L33.6 46.3898L17.8029 56.8633C17.8029 56.8633 15.8891 57.6983 13.625 55.2638C11.361 52.8293 12.1235 51.238 12.1235 51.238L24.0492 36.6016Z"
                      fill="url(#paint0_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_2"
                      d="M25.0344 34.1992L36 46.151L25.0616 53.8043C25.0616 53.8043 21.8289 55.0984 18.0987 51.0172C14.3686 46.9358 15.9198 44.5105 15.9198 44.5105L25.0344 34.1992Z"
                      fill="url(#paint1_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_3"
                      d="M39 13.0195L59.1 33.6788L32.5325 50.4142C32.5325 50.4142 28.7459 50.2552 24.3978 45.4897C20.0498 40.7243 21.4096 35.8101 21.4096 35.8101L39 13.0195Z"
                      fill="url(#paint2_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_4"
                      d="M57.6709 15.3516C63.1044 21.2807 63.9858 29.2883 59.6386 33.2371C55.2916 37.186 47.3628 35.5806 41.9292 29.6515C36.4954 23.7224 35.6145 15.7148 39.9615 11.766C44.3084 7.81716 52.2372 9.42252 57.6709 15.3516Z"
                      fill="url(#paint3_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_5"
                      d="M58.3787 31.255C54.8121 34.5032 48.2143 33.0817 43.6421 28.0798C39.07 23.078 38.2547 16.39 41.8213 13.1419C45.3879 9.89364 51.9857 11.3152 56.5579 16.3171C61.1298 21.3189 61.9452 28.0069 58.3787 31.255Z"
                      fill="url(#paint4_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_6"
                      opacity="0.85"
                      d="M59.6783 28.823C60.576 24.1785 59.6544 20.5934 56.1603 16.6199C52.6662 12.6464 47.3508 10.8657 43.7796 12.7598C39.371 15.098 48.3734 13.5961 53.4577 19.5815C57.8259 24.724 58.8516 33.1009 59.6783 28.823Z"
                      fill="url(#paint5_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_7"
                      opacity="0.4"
                      d="M50.3979 25.2452C50.4549 26.7239 49.2932 27.7677 47.8032 27.5766C46.3131 27.3856 45.059 26.032 45.002 24.5532C44.945 23.0745 46.1067 22.0307 47.5968 22.2218C49.0868 22.4128 50.341 23.7664 50.3979 25.2452Z"
                      fill="url(#paint6_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_8"
                      opacity="0.6"
                      d="M36.9217 21.0039L26.4258 34.3627C26.3297 36.4604 28.2903 39.5534 30.0334 40.8344L41.2345 29.9105C39.6 28.2005 36.9591 24.1025 36.9217 21.0039Z"
                      fill="url(#paint7_radial_5179_1664)"
                    ></path>
                    <path
                      id="Vector_9"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20.0576 9.60156L21.479 11.7187L24 11.0654L22.3575 13.0272L23.7789 15.1444L21.3424 14.2397L19.7 16.2016L19.8365 13.6806L17.4 12.7759L19.9209 12.1225L20.0576 9.60156ZM58.776 52.8016L58.9623 56.4685L62.4 57.4188L59.0774 58.7347L59.2637 62.4016L57.0239 59.548L53.7014 60.8638L55.6397 57.7843L53.4 54.9307L56.8377 55.8811L58.776 52.8016ZM15.206 24.2101L15.8768 21.0016L13.4793 23.1964L10.6853 21.5563L11.9975 24.553L9.59998 26.7478L12.8085 26.405L14.1207 29.4016L14.7915 26.1931L18 25.8502L15.206 24.2101Z"
                      fill="url(#paint8_linear_5179_1664)"
                    ></path>
                  </g>
                  <defs>
                    <radialGradient
                      id="paint0_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(36.6875 32.7016) rotate(135) scale(34.9134)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint1_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(42.5937 27.2992) rotate(135) scale(44.5477 44.5279)"
                    >
                      <stop stop-color="#EF7744"></stop>
                      <stop offset="0.333333" stop-color="#E50914"></stop>
                      <stop offset="0.666667" stop-color="#A70D53"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint2_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(42.3 29.106) rotate(135) scale(31.8127)"
                    >
                      <stop stop-color="#FB540D"></stop>
                      <stop offset="0.333333" stop-color="#E50914"></stop>
                      <stop offset="0.666667" stop-color="#A70D53"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint3_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(57.675 14.7078) rotate(134.326) scale(24.0433 24.0367)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                      <stop offset="0.666667" stop-color="#F89DC6"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint4_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(52.1305 21.273) rotate(141.875) scale(9.87138 12.8159)"
                    >
                      <stop offset="0.307292" stop-color="#F89DC6"></stop>
                      <stop offset="0.645392" stop-color="#E75094"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(55.8 15.6) rotate(135) scale(13.1522)"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint6_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(49.2362 22.9648) rotate(131.079) scale(5.08644 6.006)"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint7_radial_5179_1664"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(36.8758 29.1353) rotate(137.622) scale(13.5764)"
                    >
                      <stop stop-color="#FFA984"></stop>
                      <stop
                        offset="1"
                        stop-color="#F7636B"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <linearGradient
                      id="paint8_linear_5179_1664"
                      x1="44.65"
                      y1="27.9016"
                      x2="24.25"
                      y2="48.3016"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EF7744"></stop>
                      <stop offset="0.333333" stop-color="#E50914"></stop>
                      <stop offset="0.666667" stop-color="#A70D53"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <!-- Card 4: Create profiles for kids -->
            <div
              class="group relative rounded-2xl p-5 lg:p-6 min-h-[200px] lg:min-h-[240px] flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style="
                background: linear-gradient(
                  135deg,
                  rgba(88, 34, 180, 0.25) 0%,
                  rgba(229, 9, 20, 0.2) 50%,
                  rgba(20, 20, 30, 0.9) 100%
                );
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
              "
            >
              <!-- Decorative gradient orb -->
              <div
                class="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-[#5822B4]/30 to-[#E50914]/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"
              />
              <div>
                <h3
                  class="text-white text-lg lg:text-xl font-bold mb-2 relative z-10"
                >
                  Create profiles for kids
                </h3>
                <p class="text-gray-300 text-sm lg:text-base relative z-10">
                  Send kids on adventures with their favorite characters in a
                  space made just for them—free with your membership.
                </p>
              </div>
              <div class="flex justify-end mt-4 relative z-10">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 72 72"
                  fill="none"
                  class="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <g id="profiles-core-small">
                    <path
                      id="Vector"
                      d="M10.8 15.6008C10.8 12.9499 12.949 10.8008 15.5999 10.8008H40.8C43.4509 10.8008 45.6 12.9498 45.6 15.6008V40.8007C45.6 43.4516 43.4509 45.6007 40.8 45.6007H15.6C12.949 45.6007 10.8 43.4517 10.8 40.8007V15.6008Z"
                      fill="url(#paint0_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_2"
                      d="M9.59998 14.4016C9.59998 11.7506 11.749 9.60162 14.4 9.60156H39.6C42.251 9.60156 44.4 11.7506 44.4 14.4016V39.6015C44.4 42.2525 42.251 44.4015 39.6 44.4015H14.4C11.749 44.4016 9.59998 42.2525 9.59998 39.6015V14.4016Z"
                      fill="url(#paint1_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_3"
                      d="M18.6 21.9008C18.6 23.0606 17.6598 24.0008 16.5 24.0008C15.3402 24.0008 14.4 23.0606 14.4 21.9008C14.4 20.741 15.3402 19.8008 16.5 19.8008C17.6598 19.8008 18.6 20.741 18.6 21.9008Z"
                      fill="url(#paint2_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_4"
                      d="M39.6 21.9008C39.6 23.0606 38.6598 24.0008 37.5 24.0008C36.3402 24.0008 35.4 23.0606 35.4 21.9008C35.4 20.741 36.3402 19.8008 37.5 19.8008C38.6598 19.8008 39.6 20.741 39.6 21.9008Z"
                      fill="url(#paint3_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_5"
                      d="M23.6713 29.4501C23.2437 29.1967 22.6917 29.3379 22.4383 29.7655C22.1848 30.1932 22.3261 30.7452 22.7537 30.9986C23.8254 31.6337 26.769 32.7744 30.6375 32.7744C34.506 32.7744 37.4497 31.6337 38.5213 30.9986C38.949 30.7452 39.0902 30.1932 38.8368 29.7655C38.5834 29.3379 38.0313 29.1967 37.6037 29.4501C36.8191 29.9151 34.194 30.9744 30.6375 30.9744C27.081 30.9744 24.456 29.9151 23.6713 29.4501Z"
                      fill="url(#paint4_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_6"
                      opacity="0.35"
                      d="M19.2 44.4016H28.2L32.4 27.6016C30.2787 28.1801 28.4542 29.5387 27.2921 31.4053L19.2 44.4016Z"
                      fill="url(#paint5_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_7"
                      d="M27.6 32.4016C27.6 29.7506 29.749 27.6016 32.4 27.6016L57.6 27.6016C60.2508 27.6016 62.4 29.7506 62.4 32.4016V57.6015C62.4 60.2524 60.2508 62.4016 57.6 62.4016H32.4C29.749 62.4016 27.6 60.2524 27.6 57.6016V32.4016Z"
                      fill="url(#paint6_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_8"
                      d="M36.6 39.9008C36.6 41.0606 35.6598 42.0008 34.5 42.0008C33.3402 42.0008 32.4 41.0606 32.4 39.9008C32.4 38.741 33.3402 37.8008 34.5 37.8008C35.6598 37.8008 36.6 38.741 36.6 39.9008Z"
                      fill="url(#paint7_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_9"
                      d="M57.6 39.9008C57.6 41.0606 56.6598 42.0008 55.5 42.0008C54.3402 42.0008 53.4 41.0606 53.4 39.9008C53.4 38.741 54.3402 37.8008 55.5 37.8008C56.6598 37.8008 57.6 38.741 57.6 39.9008Z"
                      fill="url(#paint8_radial_5179_7919)"
                    ></path>
                    <path
                      id="Vector_10"
                      d="M41.8213 47.6025C41.3937 47.349 40.8416 47.4903 40.5882 47.9179C40.3348 48.3455 40.476 48.8976 40.9037 49.1509C41.9753 49.786 44.919 50.9267 48.7875 50.9267C52.656 50.9267 55.5996 49.786 56.6713 49.1509C57.0989 48.8976 57.2402 48.3455 56.9867 47.9179C56.7333 47.4903 56.1813 47.349 55.7537 47.6025C54.969 48.0674 52.344 49.1267 48.7875 49.1267C45.231 49.1267 42.6059 48.0674 41.8213 47.6025Z"
                      fill="url(#paint9_radial_5179_7919)"
                    ></path>
                  </g>
                  <defs>
                    <radialGradient
                      id="paint0_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(39.075 17.6882) rotate(135) scale(32.8097)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint1_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(62.4 8.70157) rotate(133.87) scale(75.3216)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FFBDC0"></stop>
                      <stop offset="0.666667" stop-color="#F89DC6"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint2_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(60.3 11.1008) rotate(133.939) scale(68.7426 55.9547)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint3_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(60.3 11.1008) rotate(133.939) scale(68.7426 55.9547)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint4_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(60.3 11.0994) rotate(133.939) scale(68.7426 55.9548)"
                    >
                      <stop stop-color="#99421D"></stop>
                      <stop offset="0.333333" stop-color="#99161D"></stop>
                      <stop offset="0.666667" stop-color="#7D1845"></stop>
                      <stop offset="1" stop-color="#59216E"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(39.6 27.9016) rotate(135) scale(23.3345)"
                    >
                      <stop stop-color="#FFA984"></stop>
                      <stop offset="0.333333" stop-color="#FF787F"></stop>
                      <stop offset="0.666667" stop-color="#F45FA2"></stop>
                      <stop offset="1" stop-color="#C44AF1"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint6_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(61.8 29.7016) rotate(135) scale(43.2749)"
                    >
                      <stop stop-color="#EF7744"></stop>
                      <stop offset="0.333333" stop-color="#E50914"></stop>
                      <stop offset="0.666667" stop-color="#A70D53"></stop>
                      <stop offset="1" stop-color="#792A95"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint7_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(62.1 11.1008) rotate(137.146) scale(73.6614 60.3576)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                      <stop offset="0.666667" stop-color="#FADCE9"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint8_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(62.1 11.1008) rotate(137.146) scale(73.6614 60.3576)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                      <stop offset="0.666667" stop-color="#FADCE9"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                    <radialGradient
                      id="paint9_radial_5179_7919"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(62.1 11.1017) rotate(137.146) scale(73.6614 60.3576)"
                    >
                      <stop stop-color="#FFDCCC"></stop>
                      <stop offset="0.333333" stop-color="#FDF6F6"></stop>
                      <stop offset="0.666667" stop-color="#FADCE9"></stop>
                      <stop offset="1" stop-color="#E4A1FA"></stop>
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 md:py-24">
        <div class="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <h2 class="text-white text-3xl md:text-5xl font-black mb-12">
            Frequently Asked Questions
          </h2>
          <div class="w-full max-w-4xl mx-auto mb-12">
            <FaqItem v-for="(faq, i) in faqs" :key="i" :question="faq.question">
              <div v-html="faq.answer" />
            </FaqItem>
          </div>

          <!-- Bottom CTA -->
          <p class="text-lg md:text-xl text-white mb-6 pt-4">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-4xl mx-auto"
          >
            <div class="relative w-full sm:w-8/12 md:w-96 group">
              <input
                v-model="email"
                type="email"
                placeholder=" "
                id="email_bottom"
                class="peer w-full px-6 pt-6 pb-2 bg-black/40 border border-gray-400 rounded text-white text-base focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all h-14 md:h-16"
              />
              <label
                for="email_bottom"
                class="absolute left-6 top-4 text-gray-300 text-base transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Email address
              </label>
            </div>
            <button
              @click="handleGetStarted"
              class="flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-[#e50914] text-white text-xl md:text-2xl font-bold rounded hover:bg-red-700 transition-colors group-hover:bg-red-700 h-14 md:h-16 mt-4 sm:mt-0 w-auto"
            >
              Get Started
              <ChevronRight class="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-black py-16 px-6 md:px-12 text-[#b3b3b3]">
        <div class="max-w-6xl mx-auto">
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm mb-8 underline-offset-2"
          >
            <a href="#" class="hover:underline">FAQ</a>
            <a href="#" class="hover:underline">Help Center</a>
            <a href="#" class="hover:underline">Account</a>
            <a href="#" class="hover:underline">Media Center</a>
            <a href="#" class="hover:underline">Investor Relations</a>
            <a href="#" class="hover:underline">Jobs</a>
            <a href="#" class="hover:underline">Redeem Gift Cards</a>
            <a href="#" class="hover:underline">Buy Gift Cards</a>
            <a href="#" class="hover:underline">Ways to Watch</a>
            <a href="#" class="hover:underline">Terms of Use</a>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Cookie Preferences</a>
            <a href="#" class="hover:underline">Corporate Information</a>
            <a href="#" class="hover:underline">Contact Us</a>
            <a href="#" class="hover:underline">Speed Test</a>
            <a href="#" class="hover:underline">Legal Notices</a>
            <a href="#" class="hover:underline">Only on Netflix</a>
          </div>
          <button class="hidden sm:block text-[#b3b3b3] font-medium mb-2">
            English
          </button>

          <p class="text-sm">Netflix Max Indonesia</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Custom input floating label styles */
input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
