import { SubscriptionPlan } from './enums';
export interface RegisterDto {
    email: string;
    password: string;
    displayName?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface UpdateUserDto {
    displayName?: string;
    avatarUrl?: string;
}
export interface UpdateSubscriptionDto {
    plan: SubscriptionPlan;
}
export interface ContentQueryDto {
    page?: number;
    limit?: number;
    brand?: string;
    mediaType?: string;
    genre?: string;
    search?: string;
}
export interface AddToWatchlistDto {
    contentId: number;
}
export interface UpdateWatchProgressDto {
    contentId: number;
    progress: number;
}
