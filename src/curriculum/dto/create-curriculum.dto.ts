
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCurriculumDto {

    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @IsString()
    @IsNotEmpty()
    portfolioId: string;

}
