import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CargaLectivaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCargaLectiva(
    portfolioId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    // Verifica que el portafolio pertenezca al usuario
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para subir carga lectiva a este portafolio',
      );
    }
    const fileUrl = `/uploads/cargalectiva/${file.filename}`;

    return this.prisma.cargaLectiva.upsert({
      where: {
        portfolioId,
      },
      update: {
        fileUrl,
      },
      create: {
        fileUrl,
        portfolioId,
      },
    });
  }
}
