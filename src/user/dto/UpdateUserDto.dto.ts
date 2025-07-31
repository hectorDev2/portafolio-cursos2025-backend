import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { Role } from 'src/enum/role';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario (opcional)',
    example: 'new_test@unsaac.edu.pe',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @Matches(/@unsaac\.edu\.pe$/, {
    message: 'El correo electrónico debe ser del dominio @unsaac.edu.pe.',
  })
  email?: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario (opcional)',
    example: 'new_password123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password?: string;

  @ApiProperty({
    description: 'Nuevo nombre del usuario (opcional)',
    example: 'Jane',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  name?: string;

  @ApiProperty({
    description: 'Nuevo rol del usuario (opcional)',
    enum: Role,
    example: Role.DOCENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Rol no válido.' })
  role?: Role;

  // Add any other fields that can be updated, always with @IsOptional()
}
