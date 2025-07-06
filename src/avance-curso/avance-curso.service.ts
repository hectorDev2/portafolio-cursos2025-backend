
import { Injectable } from '@nestjs/common';
import { CreateAvanceCursoDto } from './dto/create-avance-curso.dto';
import { UpdateAvanceCursoDto } from './dto/update-avance-curso.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvanceCursoService {
  constructor(private prisma: PrismaService) {}

  create(createAvanceCursoDto: CreateAvanceCursoDto) {
    return this.prisma.avanceCurso.create({ data: createAvanceCursoDto });
  }

  findAll() {
    return this.prisma.avanceCurso.findMany();
  }

  findOne(id: string) {
    return this.prisma.avanceCurso.findUnique({ where: { id } });
  }

  update(id: string, updateAvanceCursoDto: UpdateAvanceCursoDto) {
    return this.prisma.avanceCurso.update({
      where: { id },
      data: updateAvanceCursoDto,
    });
  }

  remove(id: string) {
    return this.prisma.avanceCurso.delete({ where: { id } });
  }
}
