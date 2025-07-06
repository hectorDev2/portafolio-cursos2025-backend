import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../enum/UserRole';
import { CaratulaService } from './caratula.service';
import { diskStorage } from 'multer';
import { editFileName } from '../../utils/file-upload.utils';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Caratula')
@Controller('portfolios/:portfolioId/caratulas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class CaratulaController {
  constructor(private readonly caratulaService: CaratulaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/caratulas',
        filename: editFileName,
      }),
    }),
  )
  async uploadCaratula(
    @Param('portfolioId') portfolioId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.caratulaService.uploadCaratula(portfolioId, userId, file);
  }
}
