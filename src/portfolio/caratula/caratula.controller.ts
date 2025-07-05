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
import { CaratulaService } from './caratula.service';
import { diskStorage } from 'multer';

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
        filename: (req, file, cb) => {
          // Guardar el archivo exactamente con su nombre original
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadCaratula(
    @Param('portfolioId') portfolioId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    // Guarda solo la ruta relativa para servir el archivo
    file.path = `/uploads/caratulas/${file.filename}`;
    return this.caratulaService.uploadCaratula(portfolioId, userId, file);
  }
}
