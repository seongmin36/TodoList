import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '@/auth-accounts/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto, TagResponseDto } from './dto';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@GetUser() user: User): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll(user);
    return TagResponseDto.fromEntities(tags);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @GetUser() user: User,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.createTag(user, createTagDto);
    return TagResponseDto.fromEntity(tag);
  }
}
