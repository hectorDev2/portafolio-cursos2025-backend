import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/enum/role';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string; // Corregido: removido el '!'

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  // No es necesario @IsNotEmpty() si ya es IsOptional() y solo se valida si está presente
  name?: string; // Es opcional en tu esquema Prisma

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  lastName?: string; // Es opcional en tu esquema Prisma
  // Para el rol, generalmente solo un ADMINISTRADOR debería establecerlo
  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido.' })
  role?: Role;
}
