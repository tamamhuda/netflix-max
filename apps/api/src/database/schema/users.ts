import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { watchlist } from "./watchlist";
import { watchHistory } from "./watch-history";

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "basic",
  "standard",
  "premium",
  "max",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  subscription: subscriptionPlanEnum("subscription").notNull().default("basic"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  watchlist: many(watchlist),
  watchHistory: many(watchHistory),
}));
