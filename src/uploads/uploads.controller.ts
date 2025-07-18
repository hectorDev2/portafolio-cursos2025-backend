import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import * as path from 'path';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Get(':folder/:filename')
  getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
        const filePath = path.join(process.cwd(), 'uploads', folder, filename);
    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ message: 'Archivo no encontrado' });
      }
    });
  }
}
