import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/enum/role';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido.' })
  role?: Role;

  // Add any other fields that can be updated, always with @IsOptional()
}
