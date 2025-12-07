import { Module } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { TmdbModule } from "../tmdb/tmdb.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TmdbModule, UsersModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
