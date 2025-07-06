
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAvanceCursoDto {

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    @IsNotEmpty()
    cursoId: string;

}
