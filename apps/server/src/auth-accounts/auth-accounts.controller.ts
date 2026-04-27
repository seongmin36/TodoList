import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthAccountsService } from './auth-accounts.service';
import {
  LoginResponseDto,
  SignUpResponseDto,
  SignupRequestDto,
  LoginRequestDto,
  ResetPasswordDto,
} from './dtos/index';
import { Public } from '@/common/decorators/public.decorator';
import { GetUser } from '@/common/decorators/user.decorator';

@Controller('auth')
export class AuthAccountsController {
  constructor(private readonly authAccountsService: AuthAccountsService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() dto: SignupRequestDto): Promise<SignUpResponseDto> {
    const user = await this.authAccountsService.signUp(dto);
    return SignUpResponseDto.fromEntity(user);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authAccountsService.login(dto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @GetUser('userId') userId: number,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await this.authAccountsService.resetPassword(userId, dto);
  }
}
