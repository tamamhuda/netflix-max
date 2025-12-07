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

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
    }),

    // Database
    DatabaseModule,

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
