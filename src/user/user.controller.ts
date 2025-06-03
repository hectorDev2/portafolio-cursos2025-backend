import { Controller, Get, Param } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getAllUsers() {
    return 'This action returns all users';
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return {
      message: `This action returns user with id ${id}`,
      userId: +id,
    };
  }
}
