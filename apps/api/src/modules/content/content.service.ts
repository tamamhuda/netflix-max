import { Injectable, Inject } from "@nestjs/common";
import { DRIZZLE } from "../../database/database.module";
import { TmdbService } from "../tmdb/tmdb.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class ContentService {
  constructor(
    @Inject(DRIZZLE) private readonly db: any,
    private readonly tmdbService: TmdbService,
    private readonly redisService: RedisService
  ) {}

  async getHomeContent(hasMaxAccess: boolean) {
    // Always use the same cache key since we return all content now
    // The frontend handles the locked state
    const cacheKey = "home:full";
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const [trending, netflixOriginals, hbo, dc, wb] = await Promise.all([
      this.tmdbService.getTrending(),
      this.tmdbService.getNetflixOriginals(),
      this.tmdbService.getHBOContent(),
      this.tmdbService.getDCContent(),
      this.tmdbService.getWBContent(),
    ]);

    // Always return all content - frontend handles locked state
    const homeContent = {
      trending,
      netflixOriginals,
      hbo,
      dc,
      wb,
    };

    await this.redisService.setex(cacheKey, 3600, JSON.stringify(homeContent));
    return homeContent;
  }

  async searchContent(query: string, page: number = 1) {
    return this.tmdbService.searchMulti(query, page);
  }

  async getDetails(id: number, mediaType: "movie" | "tv") {
    const cacheKey = `details:${mediaType}:${id}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const details =
      mediaType === "movie"
        ? await this.tmdbService.getMovieDetails(id)
        : await this.tmdbService.getTVDetails(id);

    await this.redisService.setex(cacheKey, 3600, JSON.stringify(details));
    return details;
  }

  async getPublicTrending() {
    const cacheKey = "public:trending";
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const [trending, hbo] = await Promise.all([
      this.tmdbService.getTrending(),
      this.tmdbService.getHBOContent(),
    ]);

    const publicContent = {
      netflix: trending.slice(0, 10),
      max: hbo.slice(0, 10),
    };

    await this.redisService.setex(
      cacheKey,
      3600,
      JSON.stringify(publicContent)
    );
    return publicContent;
  }
}
