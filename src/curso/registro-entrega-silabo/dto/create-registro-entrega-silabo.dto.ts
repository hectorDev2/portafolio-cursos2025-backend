import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroEntregaSilaboDto {

    @ApiProperty({ description: 'URL del archivo de registro de entrega de sílabo', example: 'https://example.com/registro_silabo.pdf' })
    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @ApiProperty({ description: 'ID del curso al que pertenece el registro de entrega de sílabo', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    @IsString()
    @IsNotEmpty()
    cursoId: string;

}