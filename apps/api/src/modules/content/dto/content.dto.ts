import { createZodDto } from "nestjs-zod";
import {
  ContentQuerySchema,
  HomeContentResponseSchema,
  SearchResponseSchema,
  TmdbContentItemSchema,
  ErrorResponseSchema,
} from "@netflix-max/types";

// Request DTOs
export class ContentQueryDto extends createZodDto(ContentQuerySchema) {}

// Response DTOs
export class HomeContentResponseDto extends createZodDto(
  HomeContentResponseSchema
) {}
export class SearchResponseDto extends createZodDto(SearchResponseSchema) {}
export class ContentItemDto extends createZodDto(TmdbContentItemSchema) {}
export class ErrorResponseDto extends createZodDto(ErrorResponseSchema) {}
