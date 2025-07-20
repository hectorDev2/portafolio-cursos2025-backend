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
import { UserRole } from 'src/portfolio/enum/UserRole';
import { SilaboService } from './silabo.service';
import { diskStorage } from 'multer';
import { editFileName } from 'src/utils/file-upload.utils';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Silabo')
@Controller('cursos/:cursoId/silabo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class SilaboController {
  constructor(private readonly silaboService: SilaboService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/silabos',
        filename: editFileName,
      }),
    }),
  )
  async uploadSilabo(
    @Param('cursoId') cursoId: string,
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
    return this.silaboService.uploadSilabo(cursoId, userId, file);
  }
}
