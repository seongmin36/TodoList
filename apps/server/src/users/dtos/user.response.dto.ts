import { createZodDto } from 'nestjs-zod';
import { userProfileSchema } from '@repo/schemas';
import { User } from '../entities/user.entity';

export class UserProfileDto extends createZodDto(userProfileSchema) {
  constructor(partial: Partial<UserProfileDto>) {
    super();
    Object.assign(this, partial);
  }

  static fromEntity(user: User): UserProfileDto {
    return new UserProfileDto({
      userId: user.userId,
      name: user.name,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
