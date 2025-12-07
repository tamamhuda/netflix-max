import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { content } from "./content";

export const watchlist = pgTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contentId: uuid("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [watchlist.contentId],
    references: [content.id],
  }),
}));
