// src/silabo/dto/update-silabo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSilaboDto } from './create-silabo.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSilaboDto extends PartialType(CreateSilaboDto) {
  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  contentUrl?: string;
}
