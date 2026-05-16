import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto, TagResponseDto } from './dto';

@ApiTags('tags')
@ApiCookieAuth('access_token')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: '태그 목록 조회',
    description: '로그인한 유저의 전체 태그를 조회합니다.',
  })
  @ApiOkResponse({
    description: '태그 목록 조회 성공',
    type: TagResponseDto,
    isArray: true,
    schema: {
      example: [
        {
          id: 1,
          name: '업무',
          color: '#4a90d9',
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: '개인',
          color: '#e94e77',
          createdAt: '2026-03-02T00:00:00.000Z',
          updatedAt: '2026-03-02T00:00:00.000Z',
        },
      ],
    },
  })
  async findAll(@GetUser() user: User): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll(user);
    return TagResponseDto.fromEntities(tags);
  }

  @Post()
  @ApiOperation({
    summary: '태그 생성',
    description: '새 태그를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '태그 생성 성공',
    type: TagResponseDto,
    schema: {
      example: {
        id: 3,
        name: '공부',
        color: '#f5a623',
        createdAt: '2026-03-29T00:00:00.000Z',
        updatedAt: '2026-03-29T00:00:00.000Z',
      },
    },
  })
  async create(
    @GetUser() user: User,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.createTag(user, createTagDto);
    return TagResponseDto.fromEntity(tag);
  }
}
