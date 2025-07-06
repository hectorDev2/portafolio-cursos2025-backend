import { Injectable } from '@nestjs/common';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  create(createCurriculumDto: CreateCurriculumDto) {
    return this.prisma.curriculum.create({ data: createCurriculumDto });
  }

  findAll() {
    return this.prisma.curriculum.findMany();
  }

  findOne(id: string) {
    return this.prisma.curriculum.findUnique({ where: { id } });
  }

  update(id: string, updateCurriculumDto: UpdateCurriculumDto) {
    return this.prisma.curriculum.update({
      where: { id },
      data: updateCurriculumDto,
    });
  }

  remove(id: string) {
    return this.prisma.curriculum.delete({ where: { id } });
  }
}