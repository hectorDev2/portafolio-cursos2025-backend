import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsNotEmpty()
  portfolioId: string;
}
