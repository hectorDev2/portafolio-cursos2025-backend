import { Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dtos/create-portafolio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PortafolioDeCursosService {
  constructor(private prisma: PrismaService) {}
  // Aquí puedes implementar los métodos necesarios para manejar la lógica de negocio
  // relacionados con los portafolios de cursos, como crear, actualizar, eliminar, etc.
  // Por ejemplo:

  async create(createPortafolioDto: CreatePortafolioDto, userId: string) {
    //create un nuevo portafolio de cursos asociado al docente
    const newPortafolio = await this.prisma.portfolio.create({
      data: {
        ...createPortafolioDto,
        docenteId: userId, // Asocia el portafolio al docente que lo crea
      },
    });
    return newPortafolio;
  }
  async findAll(userId: string) {
    // Lógica para obtener todos los portafolios del docente
    return { message: 'Lista de portafolios', userId };
  }
  async findOne(id: string) {
    // Lógica para obtener un portafolio específico por su ID
    return this.prisma.portfolio.findUnique({
      where: { id },
    });
  }

  // Otros métodos como findAll, findOne, update, delete, etc. pueden ser implementados aquí.
}
