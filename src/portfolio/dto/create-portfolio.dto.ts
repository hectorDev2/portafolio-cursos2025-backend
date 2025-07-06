import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'Título del portafolio',
    example: 'Portafolio de Programación I',
  })
  @IsString({ message: 'El título debe ser un string.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres.' })
  title: string;

  @ApiProperty({
    description: 'Descripción del portafolio (opcional)',
    example:
      'Este portafolio contiene los trabajos del curso de Programación I',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser un string.' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Semestre al que pertenece el portafolio',
    example: '2025-I',
  })
  @IsString({ message: 'El semestre debe ser un string.' })
  @IsNotEmpty({ message: 'El semestre no puede estar vacío.' })
  @MaxLength(50, { message: 'El semestre no puede exceder 50 caracteres.' })
  semester: string;
}
