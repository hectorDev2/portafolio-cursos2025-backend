import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SilaboService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadSilabo(
    cursoId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
      select: { portfolio: { select: { teacherId: true } } },
    });

    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para subir sílabo a este curso',
      );
    }

    const fileUrl = `/uploads/silabos/${file.filename}`;

    return this.prisma.silabo.create({
      data: {
        fileUrl: fileUrl,
        cursoId,
      },
    });
  }
}
