// src/auth/dto/login.dto.ts
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'docente@unsaac.edu.pe',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@unsaac\.edu\.pe$/, {
    message: 'el email tiene que ser del dominio @unsaac.edu.pe.',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
