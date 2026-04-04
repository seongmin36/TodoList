import { Injectable } from '@nestjs/common';
import { CreateAuthAccountDto } from './dto/create-auth-account.dto';
import { UpdateAuthAccountDto } from './dto/update-auth-account.dto';

@Injectable()
export class AuthAccountsService {
  create(createAuthAccountDto: CreateAuthAccountDto) {
    return 'This action adds a new authAccount';
  }

  findAll() {
    return `This action returns all authAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authAccount`;
  }

  update(id: number, updateAuthAccountDto: UpdateAuthAccountDto) {
    return `This action updates a #${id} authAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} authAccount`;
  }
}
