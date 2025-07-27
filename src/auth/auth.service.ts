import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enum/role';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(
    name: string,
    lastName: string,
    email: string,
    password: string,
    role?: Role,
  ): Promise<any> {
    // 1. Check if user already exists
    console.log(name, lastName, role, email, password, 'registering user');
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser !== null) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10 is a good default

    // 3. Create the user in the database
    const newUser = await this.prisma.user.create({
      data: {
        name,
        lastName,
        email,
        role: (role || Role.DOCENTE) as any, // Default to 'DOCENTE' if no role is provided
        password: hashedPassword,
      },
    });
    console.log(newUser, 'new user created in auth service');
    // 4. Return the newly created user
    return {
      id: newUser.id,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
    };
  }

  async signIn(email: string, password: string): Promise<any> {
    // 1. Find the user by email
    const user = await this.userService.findByEmail(email);

    console.log(user, 'user found in auth service');
    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    // 2. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
