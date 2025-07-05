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
    // Verifica que el portafolio pertenezca al usuario
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para subir carátula a este portafolio',
      );
    }
    // Guarda la carátula (aquí solo se guarda la ruta del archivo)
    return this.prisma.caratula.create({
      data: {
        fileUrl: file.path, // o file.filename según configuración de Multer
        portfolioId,
      },
    });
  }
}
