import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../portfolio/enum/UserRole';

@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':filename')
  @Roles(UserRole.DOCENTE, UserRole.ADMINISTRADOR, UserRole.EVALUADOR)
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = this.fileService.getFileStream(filename);

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    fileStream.pipe(res);
  }
}
