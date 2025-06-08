import { IsEmail, IsString, MinLength } from 'class-validator';

// Ensure 'export' keyword is present here
export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
