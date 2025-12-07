import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ContentModule } from "./modules/content/content.module";
import { TmdbModule } from "./modules/tmdb/tmdb.module";
import { RedisModule } from "./modules/redis/redis.module";

@Module({
  imports: [
    // Configuration - load .env.dev first if exists, then .env as fallback
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env.dev", "../../.env"],
    }),

    // Database
    DatabaseModule,

    // Redis
    RedisModule,

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Feature modules
    UsersModule,
    AuthModule,
    ContentModule,
    TmdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
