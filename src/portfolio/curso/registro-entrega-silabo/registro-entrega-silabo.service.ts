import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegistroEntregaSilaboDto } from './dto/create-registro-entrega-silabo.dto';
import { UpdateRegistroEntregaSilaboDto } from './dto/update-registro-entrega-silabo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegistroEntregaSilaboService {
  constructor(private prisma: PrismaService) {}

  async create(
    createRegistroEntregaSilaboDto: CreateRegistroEntregaSilaboDto,
    userId: string,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: createRegistroEntregaSilaboDto.cursoId },
      include: { portfolio: true },
    });

    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para añadir un registro de entrega de sílabo a este curso',
      );
    }

    return this.prisma.registroEntregaSilabo.create({
      data: {
        ...createRegistroEntregaSilaboDto,
        fileUrl: createRegistroEntregaSilaboDto.fileUrl ?? '', // Provide a default or handle as needed
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.registroEntregaSilabo.findMany({
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
    const registroEntregaSilabo =
      await this.prisma.registroEntregaSilabo.findUnique({
        where: { id },
        include: { curso: { include: { portfolio: true } } },
      });

    if (
      !registroEntregaSilabo ||
      registroEntregaSilabo.curso.portfolio.teacherId !== userId
    ) {
      throw new NotFoundException(
        'Registro de entrega de sílabo no encontrado',
      );
    }
    return registroEntregaSilabo;
  }

  async update(
    id: string,
    updateRegistroEntregaSilaboDto: UpdateRegistroEntregaSilaboDto,
    userId: string,
  ) {
    const registroEntregaSilabo =
      await this.prisma.registroEntregaSilabo.findUnique({
        where: { id },
        include: { curso: { include: { portfolio: true } } },
      });

    if (
      !registroEntregaSilabo ||
      registroEntregaSilabo.curso.portfolio.teacherId !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este registro de entrega de sílabo',
      );
    }
    return this.prisma.registroEntregaSilabo.update({
      where: { id },
      data: updateRegistroEntregaSilaboDto,
    });
  }

  async remove(id: string, userId: string) {
    const registroEntregaSilabo =
      await this.prisma.registroEntregaSilabo.findUnique({
        where: { id },
        include: { curso: { include: { portfolio: true } } },
      });

    if (
      !registroEntregaSilabo ||
      registroEntregaSilabo.curso.portfolio.teacherId !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este registro de entrega de sílabo',
      );
    }
    return this.prisma.registroEntregaSilabo.delete({ where: { id } });
  }
}
