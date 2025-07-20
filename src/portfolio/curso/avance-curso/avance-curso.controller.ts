import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AvanceCursoService } from './avance-curso.service';
import { UpdateAvanceCursoDto } from './dto/update-avance-curso.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/portfolio/enum/UserRole';
import { editFileName } from 'src/utils/file-upload.utils';

@ApiTags('Avance Curso')
@Controller('cursos/:cursoId/avance-curso')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class AvanceCursoController {
  constructor(private readonly avanceCursoService: AvanceCursoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avance-curso',
        filename: editFileName,
      }),
    }),
  )
  async uploadAvanceCurso(
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
    return this.avanceCursoService.uploadAvanceCurso(cursoId, userId, file);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.userId;
    return this.avanceCursoService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.avanceCursoService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvanceCursoDto: UpdateAvanceCursoDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.avanceCursoService.update(id, updateAvanceCursoDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.avanceCursoService.remove(id, userId);
  }
}
