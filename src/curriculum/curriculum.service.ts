import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  create(createCurriculumDto: CreateCurriculumDto) {
    return this.prisma.curriculum.create({ data: createCurriculumDto });
  }

  findAll() {
    return this.prisma.curriculum.findMany();
  }

  findOne(id: string) {
    return this.prisma.curriculum.findUnique({ where: { id } });
  }

  update(id: string, updateCurriculumDto: UpdateCurriculumDto) {
    return this.prisma.curriculum.update({
      where: { id },
      data: updateCurriculumDto,
    });
  }

  remove(id: string) {
    return this.prisma.curriculum.delete({ where: { id } });
  }

  async uploadCurriculum(
  portfolioId: string,
  userId: string,
  file: Express.Multer.File,
) {
  // Verificamos que el portafolio exista y que pertenezca al usuario
  const portfolio = await this.prisma.portfolio.findUnique({
    where: { id: portfolioId },
    select: { teacherId: true },
  });

  if (!portfolio || portfolio.teacherId !== userId) {
    throw new ForbiddenException(
      'No tienes permiso para subir curriculum a este portafolio',
    );
  }

  // Ruta relativa del archivo (puede cambiar según dónde guardes los archivos)
  const fileUrl = `/uploads/curriculums/${file.filename}`;

  // Creamos el registro en la base de datos
  return this.prisma.curriculum.create({
    data: {
      fileUrl,
      portfolioId,
    },
  });
}


}