import { Tag } from '../entities/tag.entity';

export class TagResponseDto {
  id: number;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TagResponseDto>) {
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
