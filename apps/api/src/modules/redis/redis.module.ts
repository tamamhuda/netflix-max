import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

export const REDIS_SERVICE = "REDIS_SERVICE";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_SERVICE,
      useClass: RedisService,
    },
    RedisService,
  ],
  exports: [REDIS_SERVICE, RedisService],
})
export class RedisModule {}
