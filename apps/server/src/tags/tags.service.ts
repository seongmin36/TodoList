import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '@/users/entities/user.entity';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectPinoLogger(TagsService.name)
    private readonly logger: PinoLogger,
  ) {}

  private async findTagOrFail(id: number, userId: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id, user: { userId } },
    });
    if (!tag) {
      this.logger.warn({ tagId: id, userId }, '태그를 찾을 수 없음');
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
      this.logger.warn({ userId: user.userId, name: createTagDto.name }, '중복된 태그 이름으로 생성 시도');
      throw new ConflictException('이미 동일한 이름의 태그가 있습니다.');
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      user: { userId: user.userId },
    });
    const saved = await this.tagRepository.save(tag);
    this.logger.debug({ tagId: saved.id, name: saved.name }, '태그 생성 완료');
    return saved;
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
        this.logger.warn({ userId: user.userId, name: dto.name }, '이미 사용 중인 태그 이름으로 수정 시도');
        throw new ConflictException('이미 동일한 이름의 태그가 있습니다.');
      }
    }

    Object.assign(tag, dto);
    const saved = await this.tagRepository.save(tag);
    this.logger.debug({ tagId: id }, '태그 수정 완료');
    return saved;
  }

  async remove(id: number, user: User): Promise<void> {
    const tag = await this.findTagOrFail(id, user.userId);
    await this.tagRepository.remove(tag);
    this.logger.debug({ tagId: id }, '태그 삭제 완료');
  }
}
