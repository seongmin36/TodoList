import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthAccountsService } from './auth-accounts.service';
import { CreateAuthAccountDto } from './dto/create-auth-account.dto';
import { UpdateAuthAccountDto } from './dto/update-auth-account.dto';

@Controller('auth-accounts')
export class AuthAccountsController {
  constructor(private readonly authAccountsService: AuthAccountsService) {}

  @Post()
  create(@Body() createAuthAccountDto: CreateAuthAccountDto) {
    return this.authAccountsService.create(createAuthAccountDto);
  }

  @Get()
  findAll() {
    return this.authAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthAccountDto: UpdateAuthAccountDto) {
    return this.authAccountsService.update(+id, updateAuthAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authAccountsService.remove(+id);
  }
}
