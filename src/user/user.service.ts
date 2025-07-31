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
    // Buscar usuario por ID
    const userFound = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userFound) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    // Preparar los datos para actualizar
    const dataToUpdate: any = { ...updateUserDto };
    // Si el rol está presente, usar la sintaxis de Prisma para set
    if (updateUserDto.role !== undefined) {
      dataToUpdate.role = { set: updateUserDto.role };
    }
    // Si dateOfBirth es vacío o no existe, poner null
    if (
      dataToUpdate.dateOfBirth === '' ||
      dataToUpdate.dateOfBirth === undefined
    ) {
      dataToUpdate.dateOfBirth = null;
    } else if (
      typeof dataToUpdate.dateOfBirth === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(dataToUpdate.dateOfBirth)
    ) {
      // Si es string tipo YYYY-MM-DD, convertir a Date
      dataToUpdate.dateOfBirth = new Date(dataToUpdate.dateOfBirth);
    }
    // Eliminar campos undefined
    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key],
    );

    const user = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Convertir todos los campos null a undefined para compatibilidad con UpdateUserDto
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    const result: UpdateUserDto = {
      ...rest,
      name: rest.name ?? undefined,
      role: rest.role as UpdateUserDto['role'],
      biography: rest.biography ?? undefined,
      address: rest.address ?? undefined,
      phoneNumber: rest.phoneNumber ?? undefined,
      dateOfBirth: rest.dateOfBirth
        ? rest.dateOfBirth.toISOString()
        : undefined,
      lastName: rest.lastName ?? undefined,
      email: rest.email ?? undefined,
      password: undefined, // nunca devolver la contraseña
    };
    return result;
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
