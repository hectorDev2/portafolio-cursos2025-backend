import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRegistroEntregaSilaboDto } from './dto/update-registro-entrega-silabo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class RegistroEntregaSilaboService {
  constructor(private prisma: PrismaService) {}

  async uploadRegistroEntregaSilabo(
    cursoId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
      include: { portfolio: { select: { teacherId: true } } },
    });
    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para subir registro de entrega de sílabo a este curso',
      );
    }
    const fileUrl = `/uploads/registro-entrega-silabo/${file.filename}`;
    // Verificar si ya existe un registro para este cursoId
    const registroExistente =
      await this.prisma.registroEntregaSilabo.findUnique({
        where: { cursoId },
      });
    if (registroExistente) {
      // Si existe, actualiza el fileUrl
      return this.prisma.registroEntregaSilabo.update({
        where: { cursoId },
        data: { fileUrl },
      });
    } else {
      // Si no existe, crea el registro
      return this.prisma.registroEntregaSilabo.create({
        data: {
          fileUrl,
          cursoId,
          // Puedes agregar más campos si es necesario
        },
      });
    }
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
