import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto, TagResponseDto } from './dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@ApiCookieAuth('access_token')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@GetUser() user: User): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll(user);
    return TagResponseDto.fromEntities(tags);
  }

  @Post()
  async create(
    @GetUser() user: User,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.createTag(user, createTagDto);
    return TagResponseDto.fromEntity(tag);
  }
}
