import { Injectable } from '@nestjs/common';
import { CreateRegistroEntregaSilaboDto } from './dto/create-registro-entrega-silabo.dto';
import { UpdateRegistroEntregaSilaboDto } from './dto/update-registro-entrega-silabo.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RegistroEntregaSilaboService {
  constructor(private prisma: PrismaService) {}

  create(createRegistroEntregaSilaboDto: CreateRegistroEntregaSilaboDto) {
    return this.prisma.registroEntregaSílabo.create({ data: createRegistroEntregaSilaboDto });
  }

  findAll() {
    return this.prisma.registroEntregaSílabo.findMany();
  }

  findOne(id: string) {
    return this.prisma.registroEntregaSílabo.findUnique({ where: { id } });
  }

  update(id: string, updateRegistroEntregaSilaboDto: UpdateRegistroEntregaSilaboDto) {
    return this.prisma.registroEntregaSílabo.update({
      where: { id },
      data: updateRegistroEntregaSilaboDto,
    });
  }

  remove(id: string) {
    return this.prisma.registroEntregaSílabo.delete({ where: { id } });
  }
}