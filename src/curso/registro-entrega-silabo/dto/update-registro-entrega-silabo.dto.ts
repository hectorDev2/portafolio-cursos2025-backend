
import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroEntregaSilaboDto } from './create-registro-entrega-silabo.dto';

export class UpdateRegistroEntregaSilaboDto extends PartialType(CreateRegistroEntregaSilaboDto) {}
