import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvanceCursoDto {
  @ApiProperty({
    description: 'ID del curso al que pertenece el avance',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  cursoId: string;
  fileUrl: any;
}
