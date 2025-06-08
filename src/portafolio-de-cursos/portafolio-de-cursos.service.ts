import { Injectable } from '@nestjs/common';
import { CreatePortafolioDto } from './dtos/create-portafolio.dto';

@Injectable()
export class PortafolioDeCursosService {
  // Aquí puedes implementar los métodos necesarios para manejar la lógica de negocio
  // relacionados con los portafolios de cursos, como crear, actualizar, eliminar, etc.
  // Por ejemplo:

  async create(createPortafolioDto: CreatePortafolioDto, userId: string) {
    // Lógica para crear un portafolio
    return { message: 'Portafolio creado', userId, data: createPortafolioDto };
  }

  // Otros métodos como findAll, findOne, update, delete, etc. pueden ser implementados aquí.
}
