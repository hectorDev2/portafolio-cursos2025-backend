import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<UpdateUserDto> {
    const { password, ...userData } = createUserDto; // Extrae la contraseña del DTO

    // Define el número de rondas de salado (salt rounds).
    // Un valor más alto es más seguro pero más lento. 10-12 es un buen punto de partida.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hashea la contraseña

    // Crea un nuevo objeto con los datos del usuario y la contraseña hasheada
    const user = await this.prisma.user.create({
      data: {
        ...userData, // Resto de los datos del usuario (name, email, etc.)
        password: hashedPassword, // La contraseña hasheada
      },
    });

    // Opcional: Eliminar la contraseña del objeto de usuario antes de devolverlo
    // Esto es una buena práctica para no exponer la contraseña hasheada innecesariamente
    // en la respuesta de la API.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user; // Renombra 'password' a _ y extrae el resto
    // Convert name: null to name: undefined for compatibility with UpdateUserDto
    const result: UpdateUserDto = {
      ...rest,
      name: rest.name === null ? undefined : rest.name,
    };
    return result;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    // Convert name: null to name: undefined for compatibility with UpdateUserDto
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    const result: UpdateUserDto = {
      ...rest,
      name: rest.name === null ? undefined : rest.name,
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
