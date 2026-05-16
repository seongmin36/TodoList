import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  private async findTagOrFail(id: number, userId: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id, user: { userId } },
    });
    if (!tag) {
      throw new NotFoundException(`태그 ${id}를 찾을 수 없습니다.`);
    }
    return tag;
  }

  async findAll(user: User): Promise<Tag[]> {
    return this.tagRepository.find({
      where: { user: { userId: user.userId } },
      order: { createdAt: 'ASC' },
    });
  }

  async createTag(user: User, createTagDto: CreateTagDto): Promise<Tag> {
    const duplicate = await this.tagRepository.findOne({
      where: {
        user: { userId: user.userId },
        name: createTagDto.name,
      },
    });
    if (duplicate) {
      throw new ConflictException('이미 동일한 이름의 태그가 있습니다.');
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      user: { userId: user.userId },
    });
    return await this.tagRepository.save(tag);
  }

  async findOne(id: number, user: User): Promise<Tag> {
    return this.findTagOrFail(id, user.userId);
  }

  async update(id: number, user: User, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findTagOrFail(id, user.userId);

    if (dto.name !== undefined && dto.name !== tag.name) {
      const nameTaken = await this.tagRepository.findOne({
        where: {
          user: { userId: user.userId },
          name: dto.name,
        },
      });
      if (nameTaken) {
        throw new ConflictException('이미 동일한 이름의 태그가 있습니다.');
      }
    }

    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number, user: User): Promise<void> {
    const tag = await this.findTagOrFail(id, user.userId);
    await this.tagRepository.remove(tag);
  }
}
