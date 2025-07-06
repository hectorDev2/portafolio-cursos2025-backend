
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistroEntregaSilaboService } from './registro-entrega-silabo.service';
import { CreateRegistroEntregaSilaboDto } from './dto/create-registro-entrega-silabo.dto';
import { UpdateRegistroEntregaSilaboDto } from './dto/update-registro-entrega-silabo.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Registro Entrega Silabo')
@Controller('registro-entrega-silabo')
export class RegistroEntregaSilaboController {
  constructor(private readonly registroEntregaSilaboService: RegistroEntregaSilaboService) {}

  @Post()
  create(@Body() createRegistroEntregaSilaboDto: CreateRegistroEntregaSilaboDto) {
    return this.registroEntregaSilaboService.create(createRegistroEntregaSilaboDto);
  }

  @Get()
  findAll() {
    return this.registroEntregaSilaboService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroEntregaSilaboService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistroEntregaSilaboDto: UpdateRegistroEntregaSilaboDto) {
    return this.registroEntregaSilaboService.update(id, updateRegistroEntregaSilaboDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroEntregaSilaboService.remove(id);
  }
}
