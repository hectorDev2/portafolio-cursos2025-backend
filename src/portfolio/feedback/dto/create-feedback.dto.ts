
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsString()
    @IsNotEmpty()
    evaluatorId: string;

    @IsString()
    @IsNotEmpty()
    portfolioId: string;

}
