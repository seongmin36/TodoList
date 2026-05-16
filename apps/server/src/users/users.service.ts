import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(
    userId: number,
    options: { onlyActive?: boolean } = {},
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (options.onlyActive && !user.isActive) {
      throw new UnauthorizedException('계정이 비활성화되었습니다.');
    }

    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(userId, { onlyActive: true });

    Object.assign(user, dto);
    return await this.userRepository.save(user);
  }

  async deleteMe(userId: number): Promise<void> {
    const user = await this.findOne(userId, { onlyActive: true });
    user.isActive = false;

    await this.userRepository.save(user);
    await this.userRepository.softRemove(user);
  }
}
