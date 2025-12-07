import { SubscriptionPlan, ContentBrand, MediaType } from './enums';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  subscription: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  mediaType: MediaType;
  releaseDate?: Date;
  voteAverage: number;
  brand: ContentBrand;
  isMax: boolean;
  genres: string[];
}

export interface Watchlist {
  id: string;
  userId: string;
  contentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchHistory {
  id: string;
  userId: string;
  contentId: number;
  progress: number;
  lastWatchedAt: Date;
}
