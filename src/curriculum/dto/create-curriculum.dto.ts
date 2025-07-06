import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'ID del portafolio al que pertenece el currículum',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  portfolioId: string;

  @ApiProperty({
    description: 'URL del archivo subido',
    example: '/uploads/curriculum/archivo.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
