import { createZodDto } from 'nestjs-zod';
import { tagResponseSchema } from '@repo/schemas';
import { Tag } from '../entities/tag.entity';

export class TagResponseDto extends createZodDto(tagResponseSchema) {
  constructor(partial: Partial<TagResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  static fromEntity(tag: Tag): TagResponseDto {
    return new TagResponseDto({
      id: Number(tag.id),
      name: tag.name,
      color: tag.color,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  }

  static fromEntities(tags: Tag[]): TagResponseDto[] {
    return tags.map((tag) => TagResponseDto.fromEntity(tag));
  }
}
