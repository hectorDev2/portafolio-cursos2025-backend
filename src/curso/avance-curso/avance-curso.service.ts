import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvanceCursoDto } from './dto/create-avance-curso.dto';
import { UpdateAvanceCursoDto } from './dto/update-avance-curso.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvanceCursoService {
  constructor(private prisma: PrismaService) {}

  async create(createAvanceCursoDto: CreateAvanceCursoDto, userId: string) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: createAvanceCursoDto.cursoId },
      include: { portfolio: true },
    });

    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para añadir un avance de curso a este curso',
      );
    }

    return this.prisma.avanceCurso.create({
      data: {
        ...createAvanceCursoDto,
        fileUrl: createAvanceCursoDto.fileUrl, // Ensure fileUrl is present
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.avanceCurso.findMany({
      where: {
        curso: {
          portfolio: {
            teacherId: userId,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const avanceCurso = await this.prisma.avanceCurso.findUnique({
      where: { id },
      include: { curso: { include: { portfolio: true } } },
    });

    if (!avanceCurso || avanceCurso.curso.portfolio.teacherId !== userId) {
      throw new NotFoundException('Avance de curso no encontrado');
    }
    return avanceCurso;
  }

  async update(
    id: string,
    updateAvanceCursoDto: UpdateAvanceCursoDto,
    userId: string,
  ) {
    const avanceCurso = await this.prisma.avanceCurso.findUnique({
      where: { id },
      include: { curso: { include: { portfolio: true } } },
    });

    if (!avanceCurso || avanceCurso.curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este avance de curso',
      );
    }
    return this.prisma.avanceCurso.update({
      where: { id },
      data: updateAvanceCursoDto,
    });
  }

  async remove(id: string, userId: string) {
    const avanceCurso = await this.prisma.avanceCurso.findUnique({
      where: { id },
      include: { curso: { include: { portfolio: true } } },
    });

    if (!avanceCurso || avanceCurso.curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este avance de curso',
      );
    }
    return this.prisma.avanceCurso.delete({ where: { id } });
  }
}
