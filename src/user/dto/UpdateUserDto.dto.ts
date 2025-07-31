import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  Matches,
  IsDateString,
} from 'class-validator';
import { Role } from 'src/enum/role';
import { CreateUserDto } from './CreateUserDto.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Número de teléfono del usuario (opcional)',
    example: '943834699',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
  @Matches(/^\d{9}$/, {
    message: 'El número de teléfono debe tener 9 dígitos numéricos.',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Dirección del usuario (opcional)',
    example: 'Pasaje Los Sauces B-15',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  address?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario (opcional)',
    example: '1998-12-20',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD.',
    },
  )
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Biografía del usuario (opcional)',
    example: 'Hola, soy un docente apasionado por la enseñanza.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto.' })
  biography?: string;

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
    example: 'NewPassword123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.',
  })
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
}
