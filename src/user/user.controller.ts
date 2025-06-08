import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //? CRUD

  //! READ
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
