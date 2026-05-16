import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, UserProfileDto } from './dtos';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: '내 프로필 조회',
    description: '로그인한 유저의 프로필 정보를 반환합니다.',
  })
  @ApiOkResponse({
    description: '프로필 조회 성공',
    type: UserProfileDto,
    schema: {
      example: {
        userId: 1,
        name: '홍길동',
        profileImage: null,
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-03-29T00:00:00.000Z',
      },
    },
  })
  getMe(@GetUser() user: User): UserProfileDto {
    return UserProfileDto.fromEntity(user);
  }

  @Patch('me')
  @ApiOperation({
    summary: '프로필 수정',
    description: '이름 또는 프로필 이미지를 수정합니다.',
  })
  @ApiOkResponse({
    description: '프로필 수정 성공',
    type: UserProfileDto,
  })
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '계정과 관련된 모든 데이터를 삭제합니다.',
  })
  @ApiNoContentResponse({ description: '회원 탈퇴 성공' })
  async remove(@GetUser() user: User): Promise<void> {
    await this.usersService.deleteMe(user.userId);
  }
}
