import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  DOCENTE = 'DOCENTE',
  EVALUADOR = 'EVALUADOR',
}

import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //? CRUD

  //! READ
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCENTE)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  //! READ by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCENTE)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
  //! UPDATE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCENTE)
  @Post(':id')
  @HttpCode(HttpStatus.OK) // Devuelve un código de estado 200 OK
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(id, updateUserDto);
  }

  //! DELETE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCENTE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código de estado 204 No Content
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
