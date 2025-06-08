import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(name: string, email: string, password: string): Promise<any> {
    // 1. Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10 is a good default

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the hashed password
      },
    });
    // 3. Return the user data (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Destructure to omit password
    return result;
  }

  async signIn(email: string, password: string): Promise<any> {
    // 1. Find the user by email
    const user = await this.userService.findByEmail(email);
    console.log(user.password, 'user found in signIn method');

    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    console.log(password, ' provided in signIn method');
    // 2. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }
    console.log('Password is valid, generating JWT');
    // 3. Generate a JWT token
    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    console.log('JWT generated:', token);

    // 4. Return the user data and token (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Destructure to omit password
    result.token = token; // Add the token to the result
    console.log('Returning user data without password:', result);

    return result;
  }
}
