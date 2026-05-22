import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UpdateProfileDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectPinoLogger(UsersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findOne(
    userId: number,
    options: { onlyActive?: boolean } = {},
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      this.logger.warn({ userId }, '사용자를 찾을 수 없음');
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (options.onlyActive && !user.isActive) {
      this.logger.warn({ userId }, '비활성화된 계정 접근 시도');
      throw new UnauthorizedException('계정이 비활성화되었습니다.');
    }

    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findOne(userId, { onlyActive: true });

    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    this.logger.debug({ userId }, '프로필 수정 완료');
    return saved;
  }

  async deleteMe(userId: number): Promise<void> {
    const user = await this.findOne(userId, { onlyActive: true });
    user.isActive = false;

    await this.userRepository.save(user);
    await this.userRepository.softRemove(user);
    this.logger.debug({ userId }, '회원 탈퇴 완료');
  }
}
