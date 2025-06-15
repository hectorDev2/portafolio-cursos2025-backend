import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePortafolioDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título no puede estar vacío.' })
  @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres.' })
  title: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'El semestre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El semestre no puede estar vacío.' })
  @MaxLength(50, { message: 'El semestre no puede exceder los 50 caracteres.' })
  semester: string; // Ej. "2025-1"

  @IsString({ message: 'El nombre del curso debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del curso no puede estar vacío.' })
  @MaxLength(255, {
    message: 'El nombre del curso no puede exceder los 255 caracteres.',
  })
  courseName: string;

  @IsString({ message: 'El código del curso debe ser una cadena de texto.' })
  @IsOptional()
  @MaxLength(50, {
    message: 'El código del curso no puede exceder los 50 caracteres.',
  })
  courseCode?: string;

  // Nota: 'docenteId' no está aquí porque se obtendrá del token del usuario autenticado en el controlador/servicio.
}
