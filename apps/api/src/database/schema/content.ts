import {
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  timestamp,
  real,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["movie", "tv"]);
export const contentBrandEnum = pgEnum("content_brand", [
  "netflix",
  "hbo",
  "dc",
  "wb",
]);

export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  overview: text("overview"),
  posterPath: varchar("poster_path", { length: 500 }),
  backdropPath: varchar("backdrop_path", { length: 500 }),
  mediaType: mediaTypeEnum("media_type").notNull(),
  releaseDate: timestamp("release_date"),
  voteAverage: real("vote_average"),
  brand: contentBrandEnum("brand").notNull().default("netflix"),
  isMax: boolean("is_max").notNull().default(false),
  genres: text("genres").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
