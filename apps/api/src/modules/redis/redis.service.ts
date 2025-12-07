import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis as UpstashRedis } from "@upstash/redis";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private upstashClient: UpstashRedis | null = null;
  private ioredisClient: Redis | null = null;
  private useUpstash: boolean = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const upstashUrl = this.configService.get<string>("UPSTASH_REDIS_REST_URL");
    const upstashToken = this.configService.get<string>(
      "UPSTASH_REDIS_REST_TOKEN"
    );

    if (upstashUrl && upstashToken) {
      // Use Upstash REST API for serverless
      this.upstashClient = new UpstashRedis({
        url: upstashUrl,
        token: upstashToken,
      });
      this.useUpstash = true;
      console.log("🔴 Redis: Using Upstash REST API (serverless)");
    } else {
      // Fall back to ioredis for local development
      const redisUrl =
        this.configService.get<string>("REDIS_URL") || "redis://localhost:6379";
      this.ioredisClient = new Redis(redisUrl);
      this.useUpstash = false;
      console.log("🔴 Redis: Using ioredis (local)");
    }
  }

  async onModuleDestroy() {
    if (this.ioredisClient) {
      await this.ioredisClient.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useUpstash && this.upstashClient) {
      return this.upstashClient.get<string>(key);
    }
    if (this.ioredisClient) {
      return this.ioredisClient.get(key);
    }
    return null;
  }

  async set(key: string, value: string): Promise<void> {
    if (this.useUpstash && this.upstashClient) {
      await this.upstashClient.set(key, value);
    } else if (this.ioredisClient) {
      await this.ioredisClient.set(key, value);
    }
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    if (this.useUpstash && this.upstashClient) {
      await this.upstashClient.setex(key, seconds, value);
    } else if (this.ioredisClient) {
      await this.ioredisClient.setex(key, seconds, value);
    }
  }

  async del(key: string): Promise<void> {
    if (this.useUpstash && this.upstashClient) {
      await this.upstashClient.del(key);
    } else if (this.ioredisClient) {
      await this.ioredisClient.del(key);
    }
  }
}
