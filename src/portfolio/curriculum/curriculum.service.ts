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
    // Elimina el currículum existente si hay alguno
    const existingCurriculum = await this.prisma.curriculum.findFirst({
      where: { portfolioId },
    });

    if (existingCurriculum) {
      await this.prisma.curriculum.delete({
        where: { id: existingCurriculum.id },
      });
    }

    // Guarda el currículum (ruta relativa)
    return this.prisma.curriculum.create({
      data: {
        fileUrl: file.path,
        portfolioId,
      },
    });
  }
}
