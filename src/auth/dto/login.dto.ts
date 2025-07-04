// src/auth/dto/login.dto.ts
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@unsaac\.edu\.pe$/, {
    message: 'el email tiene que ser del dominio @unsaac.edu.pe.',
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
