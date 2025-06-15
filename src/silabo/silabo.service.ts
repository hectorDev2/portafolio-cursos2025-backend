// src/silabo/silabo.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path as needed
import { CreateSilaboDto } from './dto/create-silabo.dto';
import { UpdateSilaboDto } from './dto/update-silabo.dto';
import { UserRole } from 'src/portafolio-de-cursos/enum/UserRole'; // Adjust path as needed

@Injectable()
export class SilaboService {
  constructor(private prisma: PrismaService) {}

  async create(createSilaboDto: CreateSilaboDto, userId: string) {
    const { portfolioId, ...rest } = createSilaboDto;

    // Verify if the portfolio exists and belongs to the user trying to add the silabo
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found.`,
      );
    }

    if (portfolio.docenteId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to add documents to this portfolio.`,
      );
    }

    return this.prisma.silabo.create({
      data: {
        ...rest,
        portfolio: {
          connect: { id: portfolioId },
        },
      },
    });
  }

  async findAllByPortfolio(
    portfolioId: string,
    userId: string,
    userRole: UserRole,
  ) {
    // Check if the portfolio exists
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with ID "${portfolioId}" not found.`,
      );
    }

    // Authorization check:
    // - ADMIN and EVALUADOR can see any silabo in any portfolio
    // - DOCENTE can only see silabos in their own portfolios
    if (userRole === UserRole.DOCENTE && portfolio.docenteId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to view documents for this portfolio.`,
      );
    }

    return this.prisma.silabo.findMany({
      where: { portfolioId },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const silabo = await this.prisma.silabo.findUnique({
      where: { id },
      include: { portfolio: true }, // Include portfolio to check ownership
    });

    if (!silabo) {
      throw new NotFoundException(`Silabo with ID "${id}" not found.`);
    }

    // Authorization check:
    // - ADMIN and EVALUADOR can see any silabo
    // - DOCENTE can only see silabos in their own portfolios
    if (
      userRole === UserRole.DOCENTE &&
      silabo.portfolio.docenteId !== userId
    ) {
      throw new UnauthorizedException(
        `You are not authorized to view this document.`,
      );
    }

    return silabo;
  }

  async update(id: string, updateSilaboDto: UpdateSilaboDto, userId: string) {
    // First, find the silabo and its associated portfolio to check ownership
    const silabo = await this.prisma.silabo.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!silabo) {
      throw new NotFoundException(`Silabo with ID "${id}" not found.`);
    }

    // Only the owner (docente) of the portfolio can update the silabo
    if (silabo.portfolio.docenteId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to update this document.`,
      );
    }

    return this.prisma.silabo.update({
      where: { id },
      data: updateSilaboDto,
    });
  }

  async remove(id: string, userId: string) {
    // First, find the silabo and its associated portfolio to check ownership
    const silabo = await this.prisma.silabo.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!silabo) {
      throw new NotFoundException(`Silabo with ID "${id}" not found.`);
    }

    // Only the owner (docente) of the portfolio can remove the silabo
    if (silabo.portfolio.docenteId !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to delete this document.`,
      );
    }

    return this.prisma.silabo.delete({
      where: { id },
    });
  }
}
