import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthAccountsService } from './auth-accounts.service';
import {
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
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: true }> {
    const accessToken = await this.authAccountsService.login(dto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 하루
    });

    return { ok: true };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { ok: true };
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
