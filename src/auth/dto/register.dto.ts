import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Ensure 'export' keyword is present here
export class RegisterDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Perez' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'nuevo.docente@unsaac.edu.pe',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@unsaac\.edu\.pe$/, {
    message: 'el email tiene que ser del dominio @unsaac.edu.pe.',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'securepassword',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
