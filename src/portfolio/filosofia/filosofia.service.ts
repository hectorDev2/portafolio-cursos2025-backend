import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilosofiaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFilosofia(
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
        'No tienes permiso para subir filosofía a este portafolio',
      );
    }
    // Guarda la filosofía (ruta relativa)
    return this.prisma.filosofía.create({
      data: {
        fileUrl: file.path,
        portfolioId,
      },
    });
  }
}
