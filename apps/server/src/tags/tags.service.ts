import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(user: User): Promise<Tag[]> {
    return this.tagRepository.find({
      where: { user: { userId: user.userId } },
      order: { createdAt: 'ASC' },
    });
  }

  async createTag(user: User, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
      user: { userId: user.userId },
    });
    return await this.tagRepository.save(tag);
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
