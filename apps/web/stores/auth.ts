import { defineStore } from "pinia";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  subscription: "basic" | "standard" | "premium" | "max";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasMaxAccess: (state) => state.user?.subscription === "max",
    currentPlan: (state) => state.user?.subscription || "basic",
  },

  actions: {
    // Initialize from localStorage on app load
    init() {
      if (import.meta.client) {
        const token = localStorage.getItem("auth_token");
        const user = localStorage.getItem("auth_user");
        if (token && user) {
          this.token = token;
          this.user = JSON.parse(user);
        }
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.post<AuthResponse>("/auth/login", {
          email,
          password,
        });

        this.token = response.accessToken;
        this.user = response.user;

        // Persist to localStorage
        if (import.meta.client) {
          localStorage.setItem("auth_token", response.accessToken);
          localStorage.setItem("auth_user", JSON.stringify(response.user));
        }

        return { success: true };
      } catch (err: any) {
        this.error = err?.data?.message || "Login failed";
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async register(email: string, password: string, displayName?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.post<AuthResponse>("/auth/register", {
          email,
          password,
          displayName,
        });

        this.token = response.accessToken;
        this.user = response.user;

        // Persist to localStorage
        if (import.meta.client) {
          localStorage.setItem("auth_token", response.accessToken);
          localStorage.setItem("auth_user", JSON.stringify(response.user));
        }

        return { success: true };
      } catch (err: any) {
        this.error = err?.data?.message || "Registration failed";
        return { success: false, error: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;

      if (import.meta.client) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    },

    // Toggle plan for demo purposes (without API)
    togglePlan() {
      if (this.user) {
        this.user = {
          ...this.user,
          subscription: this.user.subscription === "max" ? "basic" : "max",
        };
        if (import.meta.client) {
          localStorage.setItem("auth_user", JSON.stringify(this.user));
        }
      }
    },

    // Set plan directly
    setPlan(plan: "basic" | "standard" | "premium" | "max") {
      if (this.user) {
        this.user = { ...this.user, subscription: plan };
        if (import.meta.client) {
          localStorage.setItem("auth_user", JSON.stringify(this.user));
        }
      }
    },
  },
});
