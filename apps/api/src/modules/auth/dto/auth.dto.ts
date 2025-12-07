import { createZodDto } from "nestjs-zod";
import {
  RegisterSchema,
  LoginSchema,
  AuthResponseSchema,
  ErrorResponseSchema,
} from "@netflix-max/types";

// Request DTOs
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}

// Response DTOs
export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
export class ErrorResponseDto extends createZodDto(ErrorResponseSchema) {}
