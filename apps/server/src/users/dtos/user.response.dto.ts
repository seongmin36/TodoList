import { User } from '../entities/user.entity';

export class UserProfileDto {
  userId: number;
  name: string;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: User): UserProfileDto {
    const dto = new UserProfileDto();
    dto.userId = user.userId;
    dto.name = user.name;
    dto.profileImage = user.profileImage;
    dto.isActive = user.isActive;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
