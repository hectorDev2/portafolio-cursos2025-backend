import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCurriculum(
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
        'No tienes permiso para subir un currículum a este portafolio',
      );
    }
    const fileUrl = `/uploads/curriculum/${file.filename}`;

    return this.prisma.curriculum.upsert({
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
