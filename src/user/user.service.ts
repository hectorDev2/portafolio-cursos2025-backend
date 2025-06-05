import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(createUserDto: any): Promise<any> {
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
    const { password: _, ...result } = user; // Renombra 'password' a _ y extrae el resto
    return result;
  }

  async updateUser(id: string, updateUserDto: any): Promise<any> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return user;
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
