import { z } from "zod";
import { SubscriptionPlan } from "./enums";

// ============ REQUEST SCHEMAS ============

export const RegisterSchema = z.object({
  email: z.string().email().describe("User email address"),
  password: z.string().min(6).describe("Password (min 6 characters)"),
  displayName: z.string().optional().describe("Display name"),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email().describe("User email address"),
  password: z.string().describe("User password"),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const UpdateUserSchema = z.object({
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const UpdateSubscriptionSchema = z.object({
  plan: z.nativeEnum(SubscriptionPlan),
});
export type UpdateSubscriptionDto = z.infer<typeof UpdateSubscriptionSchema>;

export const ContentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(20),
  brand: z.string().optional(),
  mediaType: z.string().optional(),
  genre: z.string().optional(),
  search: z.string().optional(),
});
export type ContentQueryDto = z.infer<typeof ContentQuerySchema>;

export const AddToWatchlistSchema = z.object({
  contentId: z.number().int().positive(),
});
export type AddToWatchlistDto = z.infer<typeof AddToWatchlistSchema>;

export const UpdateWatchProgressSchema = z.object({
  contentId: z.number().int().positive(),
  progress: z.number().min(0).max(100),
});
export type UpdateWatchProgressDto = z.infer<typeof UpdateWatchProgressSchema>;

// ============ RESPONSE SCHEMAS ============

export const UserResponseSchema = z.object({
  id: z.string().uuid().describe("User ID"),
  email: z.string().email().describe("User email"),
  displayName: z.string().nullable().describe("Display name"),
  avatarUrl: z.string().nullable().describe("Avatar URL"),
  subscription: z.string().describe("Subscription plan"),
  createdAt: z.string().datetime().describe("Creation date"),
  updatedAt: z.string().datetime().describe("Update date"),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z.object({
  user: UserResponseSchema.describe("User data"),
  accessToken: z.string().describe("JWT access token"),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const TmdbContentItemSchema = z.object({
  id: z.number().describe("TMDB ID"),
  title: z.string().optional().describe("Movie title"),
  name: z.string().optional().describe("TV show name"),
  overview: z.string().describe("Description"),
  poster_path: z.string().nullable().describe("Poster image path"),
  backdrop_path: z.string().nullable().describe("Backdrop image path"),
  vote_average: z.number().describe("Rating"),
  release_date: z.string().optional().describe("Release date"),
  first_air_date: z.string().optional().describe("First air date"),
  media_type: z.string().optional().describe("movie or tv"),
  brand: z.string().optional().describe("Content brand (hbo, dc, wb)"),
  isMax: z.boolean().optional().describe("Is Max exclusive content"),
});
export type TmdbContentItem = z.infer<typeof TmdbContentItemSchema>;

export const HomeContentResponseSchema = z.object({
  trending: z.array(TmdbContentItemSchema).describe("Trending content"),
  netflixOriginals: z
    .array(TmdbContentItemSchema)
    .describe("Netflix originals"),
  hbo: z
    .array(TmdbContentItemSchema)
    .optional()
    .describe("HBO content (Max only)"),
  dc: z
    .array(TmdbContentItemSchema)
    .optional()
    .describe("DC content (Max only)"),
  wb: z
    .array(TmdbContentItemSchema)
    .optional()
    .describe("WB content (Max only)"),
});
export type HomeContentResponse = z.infer<typeof HomeContentResponseSchema>;

export const SearchResponseSchema = z.object({
  page: z.number().describe("Current page"),
  results: z.array(TmdbContentItemSchema).describe("Search results"),
  total_pages: z.number().describe("Total pages"),
  total_results: z.number().describe("Total results count"),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const ErrorResponseSchema = z.object({
  statusCode: z.number().describe("HTTP status code"),
  message: z.string().describe("Error message"),
  error: z.string().optional().describe("Error type"),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
