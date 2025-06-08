import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(name: string, email: string, password: string): Promise<any> {
    // 1. Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10 is a good default

    // 3. Create the user using UserService
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Optionally, you might want to remove the password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Destructure to omit password
    return result;
  }

  async signIn(email: string, password: string): Promise<any> {
    // 1. Find the user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password.');
    }

    // 2. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }

    // 3. Return the user data (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Destructure to omit password
    return result;
  }
}
