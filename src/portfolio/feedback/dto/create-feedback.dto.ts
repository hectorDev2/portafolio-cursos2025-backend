import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {

    @ApiProperty({ description: 'Comentario del feedback', example: 'Excelente trabajo en el portafolio.' })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({ description: 'ID del evaluador que realiza el feedback', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    @IsString()
    @IsNotEmpty()
    evaluatorId: string;

    @ApiProperty({ description: 'ID del portafolio al que se le da feedback', example: 'fedcba98-7654-3210-fedc-ba9876543210' })
    @IsString()
    @IsNotEmpty()
    portfolioId: string;

}