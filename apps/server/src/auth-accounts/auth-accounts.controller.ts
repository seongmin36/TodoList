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
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccountsService } from './auth-accounts.service';
import {
  SignUpResponseDto,
  SignupRequestDto,
  LoginRequestDto,
  ResetPasswordDto,
} from './dtos/index';
import { Public } from '@/common/decorators/public.decorator';
import { GetUser } from '@/common/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthAccountsController {
  constructor(private readonly authAccountsService: AuthAccountsService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '이메일과 비밀번호로 새 계정을 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '회원가입 성공',
    type: SignUpResponseDto,
    schema: { example: { id: 1, name: '홍길동' } },
  })
  async signUp(@Body() dto: SignupRequestDto): Promise<SignUpResponseDto> {
    const user = await this.authAccountsService.signUp(dto);
    return SignUpResponseDto.fromEntity(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description:
      '이메일/비밀번호 인증 후 HttpOnly 쿠키(access_token)로 액세스 토큰을 발급합니다.',
  })
  @ApiOkResponse({
    description: '로그인 성공. Set-Cookie 헤더로 access_token이 설정됩니다.',
    schema: { example: { ok: true } },
  })
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
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { ok: true };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그아웃',
    description: 'access_token 쿠키를 제거합니다.',
  })
  @ApiOkResponse({
    description: '로그아웃 성공',
    schema: { example: { ok: true } },
  })
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
  @ApiCookieAuth('access_token')
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '현재 비밀번호 확인 후 새 비밀번호로 변경합니다.',
  })
  @ApiOkResponse({ description: '비밀번호 변경 성공' })
  async resetPassword(
    @GetUser('userId') userId: number,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await this.authAccountsService.resetPassword(userId, dto);
  }
}
