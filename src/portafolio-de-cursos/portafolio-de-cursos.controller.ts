import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PortafolioDeCursosService } from './portafolio-de-cursos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Ajusta la ruta si es necesario
import { RolesGuard } from '../auth/roles.guard'; // Ajusta la ruta si es necesario
import { Roles } from '../auth/decorators/roles.decorator'; // Ajusta la ruta si es necesario
import { Role as UserRole } from '@prisma/client'; // Importa el enum Role de Prisma Client
import { CreatePortafolioDto } from './dtos/create-portafolio.dto';

// Define una interfaz para extender el objeto Request de Express con la información de usuario
import { Request } from 'express';
interface RequestWithUser extends Request {
  user: {
    userId: string; // Asegúrate de que esto coincida con el tipo 'sub' en tu JwtPayload
    email: string;
    role: UserRole; // Asegúrate de que esto coincida con el enum 'Role' de Prisma
    name?: string;
  };
}

// Aplica los guardias de autenticación y roles a todo el controlador
// Solo los DOCENTES podrán acceder a estas rutas por defecto
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
@Controller('portafolios')
export class PortafolioDeCursosController {
  constructor(
    private readonly portafolioDeCursosService: PortafolioDeCursosService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve un 201 Created al crear
  async create(
    @Body() createPortafolioDto: CreatePortafolioDto,
    @Req() req: RequestWithUser,
  ) {
    // Obtiene el ID del docente del token autenticado (req.user.userId)
    return this.portafolioDeCursosService.create(
      createPortafolioDto,
      req.user.userId,
    );
  }

  // @Get()
  // // Un docente solo ve SUS propios portafolios
  // async findAll(@Req() req: RequestWithUser) {
  //   return this.portafolioDeCursosService.findAll(req.user.userId);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
  //   const portfolio = await this.portafolioDeCursosService.findOne(id);

  //   // Lógica para permitir que el ADMIN/EVALUADOR vea cualquier portafolio,
  //   // pero el DOCENTE solo pueda ver el suyo.
  //   if (
  //     portfolio.docenteId !== req.user.userId &&
  //     req.user.role !== UserRole.ADMINISTRADOR &&
  //     req.user.role !== UserRole.EVALUADOR
  //   ) {
  //     throw new ForbiddenException(
  //       'No tiene permiso para ver este portafolio.',
  //     );
  //   }

  //   return portfolio;
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updatePortafolioDto: UpdatePortafolioDto,
  //   @Req() req: RequestWithUser,
  // ) {
  //   // La verificación de propiedad se maneja dentro del servicio
  //   return this.portafolioDeCursosService.update(
  //     id,
  //     updatePortafolioDto,
  //     req.user.userId,
  //   );
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un 204 No Content en caso de eliminación exitosa
  // async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
  //   // La verificación de propiedad se maneja dentro del servicio
  //   await this.portafolioDeCursosService.remove(id, req.user.userId);
  // }
}
