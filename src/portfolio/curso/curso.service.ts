import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CursoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCursoDto: CreateCursoDto, userId: string) {
    // LOG para depuración
    console.log('userId recibido:', userId);
    console.log('portfolioId recibido:', createCursoDto.portfolioId);
    // Verifica que el portafolio existe y pertenece al docente
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: createCursoDto.portfolioId },
    });
    console.log('Portfolio encontrado:', portfolio);
    if (!portfolio || portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para crear un curso en este portafolio',
      );
    }
    return this.prisma.curso.create({
      data: {
        ...createCursoDto,
        portfolioId: createCursoDto.portfolioId,
      },
    });
  }

  findAll(userId: string) {
    // Busca todos los cursos cuyo portafolio pertenezca al docente autenticado
    return this.prisma.curso.findMany({
      where: {
        portfolio: {
          teacherId: userId,
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    // Busca el curso y verifica que pertenezca al docente
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { portfolio: true },
    });
    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto, userId: string) {
    // Verifica que el curso pertenezca al docente antes de actualizar
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { portfolio: true },
    });
    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este curso',
      );
    }
    return this.prisma.curso.update({ where: { id }, data: updateCursoDto });
  }

  async remove(id: string, userId: string) {
    // Verifica que el curso pertenezca al docente antes de eliminar
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { portfolio: true },
    });
    if (!curso || curso.portfolio.teacherId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este curso',
      );
    }
    //eliminar todos los elementos relacionados con el curso
    await this.prisma.avanceCurso.deleteMany({
      where: { cursoId: id },
    });
    await this.prisma.registroEntregaSílabo.deleteMany({
      where: { cursoId: id },
    });
    await this.prisma.silabo.deleteMany({
      where: { cursoId: id },
    });
    return this.prisma.curso.delete({ where: { id } });
  }

  findAllByPortfolio(portfolioId: string, userId: string) {
    // Devuelve todos los cursos de un portafolio, solo si pertenece al docente
    return this.prisma.curso.findMany({
      where: {
        portfolioId,
        portfolio: { teacherId: userId },
      },
    });
  }

  async findOneByPortfolio(
    cursoId: string,
    portfolioId: string,
    userId: string,
  ) {
    // Busca un curso por id y portafolio, validando pertenencia
    const curso = await this.prisma.curso.findFirst({
      where: {
        id: cursoId,
        portfolioId,
        portfolio: { teacherId: userId },
      },
      include: { portfolio: true },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async updateByPortfolio(
    cursoId: string,
    portfolioId: string,
    updateCursoDto: UpdateCursoDto,
    userId: string,
  ) {
    // Verifica pertenencia antes de actualizar
    const curso = await this.prisma.curso.findFirst({
      where: {
        id: cursoId,
        portfolioId,
        portfolio: { teacherId: userId },
      },
    });
    if (!curso) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este curso',
      );
    }
    return this.prisma.curso.update({
      where: { id: cursoId },
      data: updateCursoDto,
    });
  }

  async removeByPortfolio(
    cursoId: string,
    portfolioId: string,
    userId: string,
  ) {
    // Verifica pertenencia antes de eliminar
    const curso = await this.prisma.curso.findFirst({
      where: {
        id: cursoId,
        portfolioId,
        portfolio: { teacherId: userId },
      },
    });
    if (!curso) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este curso',
      );
    }
    //delete all related elements
    await this.prisma.avanceCurso.deleteMany({
      where: { cursoId },
    });
    await this.prisma.registroEntregaSílabo.deleteMany({
      where: { cursoId },
    });
    await this.prisma.silabo.deleteMany({
      where: { cursoId },
    });
    //eliminar el curso
    console.log('Eliminando curso con ID:', cursoId);
    return this.prisma.curso.delete({ where: { id: cursoId } });
  }
}
