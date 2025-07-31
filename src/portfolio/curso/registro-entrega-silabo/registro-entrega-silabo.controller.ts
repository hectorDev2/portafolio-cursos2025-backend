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
import { RegistroEntregaSilaboService } from './registro-entrega-silabo.service';
import { UpdateRegistroEntregaSilaboDto } from './dto/update-registro-entrega-silabo.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/portfolio/enum/UserRole';
import { editFileName } from 'src/utils/file-upload.utils';

@ApiTags('Registro Entrega Silabo')
@Controller('cursos/:cursoId/registro-entrega-silabo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class RegistroEntregaSilaboController {
  constructor(
    private readonly registroEntregaSilaboService: RegistroEntregaSilaboService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/registro-entrega-silabo',
        filename: editFileName,
      }),
    }),
  )
  async uploadRegistroEntregaSilabo(
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
    return this.registroEntregaSilaboService.uploadRegistroEntregaSilabo(
      cursoId,
      userId,
      file,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.userId;
    return this.registroEntregaSilaboService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.registroEntregaSilaboService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistroEntregaSilaboDto: UpdateRegistroEntregaSilaboDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.registroEntregaSilaboService.update(
      id,
      updateRegistroEntregaSilaboDto,
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.registroEntregaSilaboService.remove(id, userId);
  }
}
