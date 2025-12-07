import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  ErrorResponseDto,
} from "./dto/auth.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto, description: "User registration data" })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "Email already exists",
    type: ErrorResponseDto,
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiBody({ type: LoginDto, description: "User login credentials" })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
    type: ErrorResponseDto,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
