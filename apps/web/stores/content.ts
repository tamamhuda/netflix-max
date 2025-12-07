import { defineStore } from "pinia";

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  brand?: string;
  isMax?: boolean;
}

interface HomeContent {
  trending: ContentItem[];
  netflixOriginals: ContentItem[];
  hbo?: ContentItem[];
  dc?: ContentItem[];
  wb?: ContentItem[];
}

interface ContentDetails extends ContentItem {
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      official: boolean;
    }>;
  };
  credits?: {
    cast: Array<{ name: string; character: string }>;
  };
}

interface ContentState {
  homeContent: HomeContent | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Fallback mock data for unauthenticated users
const MOCK_DATA: HomeContent = {
  trending: [
    {
      id: 1,
      title: "Stranger Things",
      overview: "A mystery involving secret experiments.",
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.6,
      media_type: "tv",
    },
  ],
  netflixOriginals: [
    {
      id: 2,
      name: "Squid Game",
      overview: "A survival game with deadly stakes.",
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.0,
    },
  ],
  hbo: [
    {
      id: 3,
      name: "House of the Dragon",
      overview: "The Targaryen dynasty.",
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.4,
      brand: "hbo",
      isMax: true,
    },
  ],
  dc: [
    {
      id: 4,
      title: "The Batman",
      overview: "Gotham's dark knight.",
      poster_path: null,
      backdrop_path: null,
      vote_average: 7.8,
      brand: "dc",
      isMax: true,
    },
  ],
  wb: [
    {
      id: 5,
      title: "Dune: Part Two",
      overview: "Paul Atreides unites with the Fremen.",
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.5,
      brand: "wb",
      isMax: true,
    },
  ],
};

export const useContentStore = defineStore("content", {
  state: (): ContentState => ({
    homeContent: null,
    isLoading: false,
    error: null,
    lastFetched: null,
  }),

  getters: {
    trending: (state) => state.homeContent?.trending || [],
    netflixOriginals: (state) => state.homeContent?.netflixOriginals || [],
    hboContent: (state) => state.homeContent?.hbo || [],
    dcContent: (state) => state.homeContent?.dc || [],
    wbContent: (state) => state.homeContent?.wb || [],

    getMaxContent: (state) => ({
      hboOriginals: state.homeContent?.hbo || [],
      dcUniverse: state.homeContent?.dc || [],
      wbFilms: state.homeContent?.wb || [],
    }),
    getNetflixContent: (state) => state.homeContent?.netflixOriginals || [],
  },

  actions: {
    async fetchHomeContent(forceRefresh = false) {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        this.homeContent = MOCK_DATA;
        return;
      }

      const CACHE_DURATION = 5 * 60 * 1000;
      if (
        !forceRefresh &&
        this.lastFetched &&
        Date.now() - this.lastFetched < CACHE_DURATION &&
        this.homeContent
      ) {
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const api = useApi();
        const content = await api.get<HomeContent>("/content/home");

        this.homeContent = content;
        this.lastFetched = Date.now();
      } catch (err: any) {
        this.error = err?.data?.message || "Failed to fetch content";
        if (!this.homeContent) {
          this.homeContent = MOCK_DATA;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async fetchContentDetails(
      id: number,
      mediaType: "movie" | "tv"
    ): Promise<ContentDetails | null> {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        return null;
      }

      try {
        const api = useApi();
        return await api.get<ContentDetails>(`/content/${mediaType}/${id}`);
      } catch (err) {
        console.error("Failed to fetch content details:", err);
        return null;
      }
    },

    async searchContent(
      query: string,
      page = 1
    ): Promise<{ results: any[]; total_results: number; total_pages: number }> {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        return { results: [], total_results: 0, total_pages: 0 };
      }

      try {
        const api = useApi();
        const response = await api.get<{
          results: any[];
          total_results: number;
          total_pages: number;
        }>(`/content/search?search=${encodeURIComponent(query)}&page=${page}`);
        return response || { results: [], total_results: 0, total_pages: 0 };
      } catch (err) {
        console.error("Search error:", err);
        return { results: [], total_results: 0, total_pages: 0 };
      }
    },

    clearCache() {
      this.homeContent = null;
      this.lastFetched = null;
    },
  },
});
