import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  createUser(@Req() req) {
    const data = req.body;
    return this.usersService.createUser(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Get(':id/tests')
  getAllUserTests(@Param('id') id: string) {
    return this.usersService.getAllUserTests(+id);
  }
}
