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
import { diskStorage } from 'multer';
import { CurriculumService } from './curriculum.service';
import { editFileName } from 'src/utils/file-upload.utils';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Curriculum')
@Controller('portfolios/:portfolioId/curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/curriculum',
        filename: editFileName,
      }),
    }),
  )
  async uploadCurriculum(
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
    return this.curriculumService.uploadCurriculum(portfolioId, userId, file);
  }
}
