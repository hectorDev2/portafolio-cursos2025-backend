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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../enum/UserRole';
import { FilosofiaService } from './filosofia.service';
import { diskStorage } from 'multer';

@Controller('portfolios/:portfolioId/filosofias')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class FilosofiaController {
  constructor(private readonly filosofiaService: FilosofiaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/filosofias',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFilosofia(
    @Param('portfolioId') portfolioId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    file.path = `/uploads/filosofias/${file.filename}`;
    return this.filosofiaService.uploadFilosofia(portfolioId, userId, file);
  }
}
