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
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //? CRUD
  //* Create, Read, Update, Delete

  //! CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve un código de estado 201 Created
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  //! READ
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Primero autentica con JWT, luego verifica roles
  @Roles('ADMIN') // Solo usuarios con rol 'ADMIN' pueden acceder
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  //! READ by ID
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
  //! UPDATE
  @Post(':id')
  @HttpCode(HttpStatus.OK) // Devuelve un código de estado 200 OK
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(id, updateUserDto);
  }

  //! DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código de estado 204 No Content
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
