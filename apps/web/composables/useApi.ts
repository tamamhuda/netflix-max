type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch = async <T>(
    endpoint: string,
    method: HttpMethod = "GET",
    options: FetchOptions = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // Add auth token if available
    const token = authStore.token;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method,
      headers,
      body: options.body,
    });
  };

  return {
    get: <T>(endpoint: string) => apiFetch<T>(endpoint, "GET"),

    post: <T>(endpoint: string, body?: Record<string, unknown>) =>
      apiFetch<T>(endpoint, "POST", { body }),

    put: <T>(endpoint: string, body?: Record<string, unknown>) =>
      apiFetch<T>(endpoint, "PUT", { body }),

    delete: <T>(endpoint: string) => apiFetch<T>(endpoint, "DELETE"),
  };
}
