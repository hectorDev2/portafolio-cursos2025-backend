import { PartialType } from '@nestjs/mapped-types';
import { CreateSilaboDto } from './create-silabo.dto';

export class UpdateSilaboDto extends PartialType(CreateSilaboDto) {}
