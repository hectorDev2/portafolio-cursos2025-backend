import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UserRole } from './enum/UserRole';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async create(createPortfolioDto: CreatePortfolioDto, userId: string) {
    const newPortfolio = await this.prisma.portfolio.create({
      data: {
        ...createPortfolioDto,
        teacherId: userId,
      },
    });
    return newPortfolio;
  }

  async findAll(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { teacherId: userId },
      include: {
        cursos: true,
        Caratula: true,
        CargaLectiva: true,
        Filosofia: true,
        Curriculum: true,
        feedbacks: true,
      },
    });
  }

  async findOne(id: string, requestUserId: string, requestUserRole: UserRole) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found.');
    }

    if (
      portfolio.teacherId !== requestUserId &&
      requestUserRole !== UserRole.ADMINISTRADOR &&
      requestUserRole !== UserRole.EVALUADOR
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this portfolio.',
      );
    }

    return portfolio;
  }

  async update(
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
    userId: string,
  ) {
    return this.prisma.portfolio.update({
      where: { id },
      data: {
        ...updatePortfolioDto,
        teacherId: userId,
      },
    });
  }

  async remove(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found.');
    }
    //eliminamos todas los cursos dentro del portafolio
    await this.prisma.curso.deleteMany({
      where: { portfolioId: id },
    });
    return await this.prisma.portfolio.delete({
      where: { id },
    });
  }

  async findByTeacherId(teacherId: string) {
    return this.prisma.portfolio.findMany({
      where: { teacherId },
    });
  }
}
