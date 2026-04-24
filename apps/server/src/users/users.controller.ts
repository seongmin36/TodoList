import { Controller, Get, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/user.request.dto';
import { UpdateUserDto } from './dtos/user.response.dto';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('me')
  updateMe(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.users_id, updateUserDto);
  }

  @Patch('me/password')
  updatePassword(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePassword(user.users_id, updateUserDto);
  }

  @Delete('me')
  remove(@GetUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
