import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PortfolioService } from 'src/portfolio/portfolio.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private portfolioService: PortfolioService,
  ) {}

  async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      include: {
        Portfolio: true, // Include related Portfolio data
      },
    });
    return users;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email, // Assuming 'email' is the field used for email in your schema
      },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: any): Promise<UpdateUserDto> {
    const { role, ...restDto } = updateUserDto;
    const userFound = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userFound) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...restDto,
        ...userFound,
        ...(role !== undefined && { role: { set: role } }),
      },
    });

    // Convert name: null to name: undefined for compatibility with UpdateUserDto
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;

    // Convert all null properties to undefined for compatibility with UpdateUserDto
    const sanitizedUser: UpdateUserDto = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ]),
    ) as UpdateUserDto;

    return sanitizedUser;
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // Si el usuario no es encontrado, lanzar una excepción NotFoundException
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    // Omitir la contraseña del objeto de usuario antes de devolverlo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async deleteUser(id: string): Promise<void> {
    try {
      //delete related portfolio first if needed
      //delete all related portfolio entries
      // This assumes that the PortfolioService has a method to remove a portfolio by user ID
      // Adjust this logic based on your actual portfolio deletion requirements
      // If you have a specific method to delete the portfolio, use that instead
      // For example, if you have a method like this:
      // await this.portfolioService.deleteByUserId(id);
      // you can call it here.
      await this.portfolioService.removeByTeacherId(id);
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      // Maneja el error de Prisma si el registro no fue encontrado para eliminar (P2025)
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Usuario con ID "${id}" no encontrado para eliminar.`,
          );
        }
      }
      // Si es otro tipo de error de Prisma o un error desconocido, relanzarlo
      throw error;
    }
  }
}
