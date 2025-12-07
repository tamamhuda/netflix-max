import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { DRIZZLE } from "../../database/database.module";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { RegisterDto, UpdateUserDto } from "@netflix-max/types";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../../database/schema";

type DrizzleDB = PostgresJsDatabase<typeof schema>;

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(registerDto: RegisterDto) {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const [user] = await this.db
      .insert(users)
      .values({
        email: registerDto.email,
        password: hashedPassword,
        displayName: registerDto.displayName,
      })
      .returning();

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async findById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        ...updateUserDto,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    const { password, ...result } = updatedUser;
    return result;
  }
}
