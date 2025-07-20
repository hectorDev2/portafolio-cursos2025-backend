import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CaratulaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCaratula(
    portfolioId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: { teacherId: true }, // Solo necesitamos el teacherId
    });

    if (!portfolio || portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para subir carátuenla a este portafolio',
      );
    }

    // Construye la URL que se puede servir al cliente
    const fileUrl = `/uploads/caratulas/${file.filename}`;

    return this.prisma.caratula.upsert({
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
