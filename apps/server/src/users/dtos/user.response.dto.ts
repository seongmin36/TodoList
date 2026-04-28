import { User } from '../entities/user.entity';

export class UserProfileDto {
  userId: number;
  name: string;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserProfileDto>) {
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
