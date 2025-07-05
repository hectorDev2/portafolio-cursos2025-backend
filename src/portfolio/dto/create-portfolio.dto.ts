import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
  @IsString({ message: 'El título debe ser un string.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres.' })
  title: string;

  @IsString({ message: 'La descripción debe ser un string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'El semestre debe ser un string.' })
  @IsNotEmpty({ message: 'El semestre no puede estar vacío.' })
  @MaxLength(50, { message: 'El semestre no puede exceder 50 caracteres.' })
  semester: string;
}
