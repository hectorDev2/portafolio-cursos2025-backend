import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ description: 'Nombre del curso', example: 'Programación I' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Código del curso (opcional)', example: 'INF-101', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'ID del portafolio al que pertenece el curso', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  @IsNotEmpty()
  portfolioId: string;
}