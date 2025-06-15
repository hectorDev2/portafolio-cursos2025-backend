// src/silabo/dto/create-silabo.dto.ts
import {
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateSilaboDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  portfolioId: string; // The ID of the portfolio this silabo belongs to

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsUrl() // Assuming contentUrl will be a URL after file upload
  @IsNotEmpty()
  contentUrl: string;
}
