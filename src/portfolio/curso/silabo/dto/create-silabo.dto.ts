import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSilaboDto {
  @IsString()
  @IsNotEmpty()
  version?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  cursoId: string;
}
