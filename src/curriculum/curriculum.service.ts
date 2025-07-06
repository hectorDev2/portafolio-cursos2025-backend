import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async create(createCurriculumDto: CreateCurriculumDto, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: createCurriculumDto.portfolioId },
    });

    if (!portfolio || portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para añadir un currículum a este portafolio',
      );
    }

    return this.prisma.curriculum.create({
      data: {
        ...createCurriculumDto,
        fileUrl: createCurriculumDto.fileUrl ?? '',
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.curriculum.findMany({
      where: {
        portfolio: {
          teacherId: userId,
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!curriculum || curriculum.portfolio.teacherId !== userId) {
      throw new NotFoundException('Currículum no encontrado');
    }
    return curriculum;
  }

  async update(
    id: string,
    updateCurriculumDto: UpdateCurriculumDto,
    userId: string,
  ) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!curriculum || curriculum.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este currículum',
      );
    }
    return this.prisma.curriculum.update({
      where: { id },
      data: updateCurriculumDto,
    });
  }

  async remove(id: string, userId: string) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!curriculum || curriculum.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este currículum',
      );
    }
    return this.prisma.curriculum.delete({ where: { id } });
  }
}
