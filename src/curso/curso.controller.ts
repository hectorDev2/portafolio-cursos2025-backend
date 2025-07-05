import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from '../portfolio/enum/UserRole';
import { Req } from '@nestjs/common';

@Controller('portfolios/:portfolioId/cursos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('portfolioId') portfolioId: string,
    @Body() createCursoDto: CreateCursoDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    // Forzamos el portfolioId del path en el DTO
    return this.cursoService.create({ ...createCursoDto, portfolioId }, userId);
  }

  @Get()
  findAll(@Param('portfolioId') portfolioId: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.cursoService.findAllByPortfolio(portfolioId, userId);
  }

  @Get(':cursoId')
  findOne(
    @Param('portfolioId') portfolioId: string,
    @Param('cursoId') cursoId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.cursoService.findOneByPortfolio(cursoId, portfolioId, userId);
  }

  @Patch(':cursoId')
  update(
    @Param('portfolioId') portfolioId: string,
    @Param('cursoId') cursoId: string,
    @Body() updateCursoDto: UpdateCursoDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.cursoService.updateByPortfolio(
      cursoId,
      portfolioId,
      updateCursoDto,
      userId,
    );
  }

  @Delete(':cursoId')
  remove(
    @Param('portfolioId') portfolioId: string,
    @Param('cursoId') cursoId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.cursoService.removeByPortfolio(cursoId, portfolioId, userId);
  }
}
