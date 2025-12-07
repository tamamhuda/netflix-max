DO $$ BEGIN
 CREATE TYPE "content_brand" AS ENUM('netflix', 'hbo', 'dc', 'wb');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "media_type" AS ENUM('movie', 'tv');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "subscription_plan" AS ENUM('basic', 'standard', 'premium', 'max');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"overview" text,
	"poster_path" varchar(500),
	"backdrop_path" varchar(500),
	"media_type" "media_type" NOT NULL,
	"release_date" timestamp,
	"vote_average" real,
	"brand" "content_brand" DEFAULT 'netflix' NOT NULL,
	"is_max" boolean DEFAULT false NOT NULL,
	"genres" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "display_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription" SET DATA TYPE subscription_plan;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_content_id_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
