import { PartialType } from '@nestjs/mapped-types';
import { CreatePortafolioDto } from './create-portafolio.dto';

// PartialType hace que todas las propiedades de CreatePortafolioDto sean opcionales.
export class UpdatePortafolioDto extends PartialType(CreatePortafolioDto) {}
