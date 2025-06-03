import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(createUserDto: any): Promise<any> {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return user;
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
