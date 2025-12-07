import { Injectable, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class TmdbService {
  private readonly client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("TMDB_API_KEY");

    this.client = axios.create({
      baseURL: "https://api.themoviedb.org/3",
      params: {
        api_key: apiKey,
      },
    });
  }

  async getTrending(
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "week"
  ) {
    try {
      const response = await this.client.get(
        `/trending/${mediaType}/${timeWindow}`
      );
      return response.data.results;
    } catch (error) {
      throw new HttpException("Failed to fetch trending content", 500);
    }
  }

  async getNetflixOriginals() {
    try {
      const response = await this.client.get("/discover/tv", {
        params: {
          with_networks: 213, // Netflix network ID
          sort_by: "popularity.desc",
        },
      });
      return response.data.results;
    } catch (error) {
      throw new HttpException("Failed to fetch Netflix originals", 500);
    }
  }

  async getHBOContent() {
    try {
      // Use with_networks=49 (HBO network) instead of with_companies
      // This returns 379+ results vs only 2 with companies
      const response = await this.client.get("/discover/tv", {
        params: {
          with_networks: 49, // HBO network ID
          sort_by: "popularity.desc",
        },
      });
      return response.data.results.map((item) => ({
        ...item,
        brand: "hbo",
        isMax: true,
      }));
    } catch (error) {
      throw new HttpException("Failed to fetch HBO content", 500);
    }
  }

  async getDCContent() {
    try {
      const response = await this.client.get("/discover/movie", {
        params: {
          with_companies: 429, // DC Entertainment
          sort_by: "popularity.desc",
        },
      });
      return response.data.results.map((item) => ({
        ...item,
        brand: "dc",
        isMax: true,
      }));
    } catch (error) {
      throw new HttpException("Failed to fetch DC content", 500);
    }
  }

  async getWBContent() {
    try {
      const response = await this.client.get("/discover/movie", {
        params: {
          with_companies: 174, // Warner Bros
          sort_by: "popularity.desc",
        },
      });
      return response.data.results.map((item) => ({
        ...item,
        brand: "wb",
        isMax: true,
      }));
    } catch (error) {
      throw new HttpException("Failed to fetch WB content", 500);
    }
  }

  async getMovieDetails(id: number) {
    try {
      const response = await this.client.get(`/movie/${id}`, {
        params: {
          append_to_response: "videos,credits",
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException("Failed to fetch movie details", 500);
    }
  }

  async getTVDetails(id: number) {
    try {
      const response = await this.client.get(`/tv/${id}`, {
        params: {
          append_to_response: "videos,credits",
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException("Failed to fetch TV details", 500);
    }
  }

  async searchMulti(query: string, page: number = 1) {
    try {
      const response = await this.client.get("/search/multi", {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException("Failed to search content", 500);
    }
  }

  async getByGenre(
    genreId: number,
    mediaType: "movie" | "tv" = "movie",
    page: number = 1
  ) {
    try {
      const response = await this.client.get(`/discover/${mediaType}`, {
        params: {
          with_genres: genreId,
          sort_by: "popularity.desc",
          page,
        },
      });
      return response.data.results;
    } catch (error) {
      throw new HttpException("Failed to fetch content by genre", 500);
    }
  }

  getImageUrl(path: string, size: string = "original") {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}
