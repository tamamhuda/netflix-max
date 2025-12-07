import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, email: user.email, role: "user" };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const payload = { sub: user.id, email: user.email, role: "user" };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
