
import { PartialType } from '@nestjs/mapped-types';
import { CreateAvanceCursoDto } from './create-avance-curso.dto';

export class UpdateAvanceCursoDto extends PartialType(CreateAvanceCursoDto) {}
