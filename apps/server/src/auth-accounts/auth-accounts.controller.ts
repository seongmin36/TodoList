import { Body, Controller, Post } from '@nestjs/common';
import { AuthAccountsService } from './auth-accounts.service';
import {
  LoginRequestDto,
  SignupRequestDto,
  SignUpResponseDto,
} from './dto/create-auth-account.dto';

@Controller('auth')
export class AuthAccountsController {
  constructor(private readonly authAccountsService: AuthAccountsService) {}

  @Post('signup')
  async signUp(@Body() dto: SignupRequestDto): Promise<SignUpResponseDto> {
    const user = await this.authAccountsService.signUp(dto);
    return SignUpResponseDto.fromEntity(user);
  }

  @Post('login')
  login(@Body() dto: LoginRequestDto) {
    return this.authAccountsService.login(dto);
  }
}
