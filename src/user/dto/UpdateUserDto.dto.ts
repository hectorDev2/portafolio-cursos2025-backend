import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { Role } from 'src/enum/role';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './CreateUserDto.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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

  @ApiProperty({
    description: 'Biografía del usuario (opcional)',
    example: 'Docente de la UNSAAC con experiencia en ...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto.' })
  biography?: string;

  @ApiProperty({
    description: 'Dirección del usuario (opcional)',
    example: 'Av. La Cultura 123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  address?: string;

  @ApiProperty({
    description: 'Teléfono del usuario (opcional)',
    example: '987654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario (opcional)',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsString({
    message:
      'La fecha de nacimiento debe ser una cadena de texto en formato ISO.',
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Apellido del usuario (opcional)',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  lastName?: string;

  // Solo agrega aquí los campos que realmente pueden ser modificados por el usuario.
}
