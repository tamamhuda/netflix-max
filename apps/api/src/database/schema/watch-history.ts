import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { content } from "./content";

export const watchHistory = pgTable("watch_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contentId: uuid("content_id")
    .notNull()
    .references(() => content.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0),
  lastWatchedAt: timestamp("last_watched_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(users, {
    fields: [watchHistory.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [watchHistory.contentId],
    references: [content.id],
  }),
}));
