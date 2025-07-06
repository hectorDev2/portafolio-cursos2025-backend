
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRegistroEntregaSilaboDto {

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    @IsNotEmpty()
    cursoId: string;

}
