
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvanceCursoService } from './avance-curso.service';
import { CreateAvanceCursoDto } from './dto/create-avance-curso.dto';
import { UpdateAvanceCursoDto } from './dto/update-avance-curso.dto';

@Controller('avance-curso')
export class AvanceCursoController {
  constructor(private readonly avanceCursoService: AvanceCursoService) {}

  @Post()
  create(@Body() createAvanceCursoDto: CreateAvanceCursoDto) {
    return this.avanceCursoService.create(createAvanceCursoDto);
  }

  @Get()
  findAll() {
    return this.avanceCursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avanceCursoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvanceCursoDto: UpdateAvanceCursoDto) {
    return this.avanceCursoService.update(id, updateAvanceCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avanceCursoService.remove(id);
  }
}
