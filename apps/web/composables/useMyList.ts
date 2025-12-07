import { ref, computed, watch } from "vue";

interface MyListItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
  addedAt: number;
}

const MY_LIST_KEY = "netflix-max-my-list";

// Shared state across components
const myList = ref<MyListItem[]>([]);
const isInitialized = ref(false);

// Initialize from localStorage
const initMyList = () => {
  if (isInitialized.value) return;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(MY_LIST_KEY);
      if (stored) {
        myList.value = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load my list from localStorage:", e);
      myList.value = [];
    }
    isInitialized.value = true;
  }
};

// Save to localStorage
const saveToStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(myList.value));
    } catch (e) {
      console.error("Failed to save my list to localStorage:", e);
    }
  }
};

// Watch for changes and persist
watch(myList, saveToStorage, { deep: true });

export function useMyList() {
  // Initialize on first use
  initMyList();

  const isInList = (id: number): boolean => {
    return myList.value.some((item) => item.id === id);
  };

  const addToList = (item: any) => {
    if (isInList(item.id)) return;

    const listItem: MyListItem = {
      id: item.id,
      title: item.title,
      name: item.name,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      media_type: item.media_type || (item.title ? "movie" : "tv"),
      addedAt: Date.now(),
    };

    myList.value.unshift(listItem); // Add to beginning
  };

  const removeFromList = (id: number) => {
    const index = myList.value.findIndex((item) => item.id === id);
    if (index > -1) {
      myList.value.splice(index, 1);
    }
  };

  const toggleInList = (item: any) => {
    if (isInList(item.id)) {
      removeFromList(item.id);
      return false;
    } else {
      addToList(item);
      return true;
    }
  };

  const clearList = () => {
    myList.value = [];
  };

  // Sorted getters
  const moviesList = computed(() =>
    myList.value.filter((item) => item.media_type === "movie")
  );

  const seriesList = computed(() =>
    myList.value.filter((item) => item.media_type === "tv")
  );

  const listCount = computed(() => myList.value.length);

  return {
    myList,
    isInList,
    addToList,
    removeFromList,
    toggleInList,
    clearList,
    moviesList,
    seriesList,
    listCount,
  };
}
