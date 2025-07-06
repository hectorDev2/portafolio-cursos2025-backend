import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/enum/role';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'test@example.com' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string; // Corregido: removido el '!'

  @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @ApiProperty({ description: 'Nombre del usuario (opcional)', example: 'John', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  // No es necesario @IsNotEmpty() si ya es IsOptional() y solo se valida si está presente
  name?: string; // Es opcional en tu esquema Prisma

  @ApiProperty({ description: 'Apellido del usuario (opcional)', example: 'Doe', required: false })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  lastName?: string; // Es opcional en tu esquema Prisma
  // Para el rol, generalmente solo un ADMINISTRADOR debería establecerlo
  @ApiProperty({ description: 'Rol del usuario (opcional)', enum: Role, example: Role.DOCENTE, required: false })
  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido.' })
  role?: Role;
}