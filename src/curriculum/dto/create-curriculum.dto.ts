import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurriculumDto {

    @ApiProperty({ description: 'URL del archivo del currículum', example: 'https://example.com/curriculum.pdf' })
    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @ApiProperty({ description: 'ID del portafolio al que pertenece el currículum', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    @IsString()
    @IsNotEmpty()
    portfolioId: string;

}