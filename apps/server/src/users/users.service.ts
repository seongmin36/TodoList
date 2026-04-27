import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    const where: FindOptionsWhere<User> = { userId };
    if (options.onlyActive) where.isActive = true;

    const user = await this.userRepository.findOne({
      where,
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
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
