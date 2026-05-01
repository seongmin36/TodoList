import { Controller, Get, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '@/auth-accounts/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/user.decorator';
import { User } from '@/users/entities/user.entity';
import { TagResponseDto } from './dto';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@GetUser() user: User): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll(user);
    return TagResponseDto.fromEntities(tags);
  }
}
