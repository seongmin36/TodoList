import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import {
  SignupRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordDto,
} from './dtos/index';
import { AuthAccount, AuthProvider } from './entities/auth-account.entity';

@Injectable()
export class AuthAccountsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthAccount)
    private readonly authAccountRepository: Repository<AuthAccount>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignupRequestDto): Promise<User> {
    const existing = await this.authAccountRepository.findOne({
      where: {
        authProvider: AuthProvider.GENERAL,
        providerUserId: dto.email,
      },
    });
    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      profileImage: null,
      isActive: true,
    });
    const savedUser = await this.userRepository.save(user);

    const authAccount = this.authAccountRepository.create({
      user: savedUser,
      authProvider: AuthProvider.GENERAL,
      providerUserId: dto.email,
      passwordHash,
    });
    await this.authAccountRepository.save(authAccount);

    return savedUser;
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const account = await this.authAccountRepository.findOne({
      where: {
        authProvider: AuthProvider.GENERAL,
        providerUserId: dto.email,
      },
      relations: ['user'],
    });

    const user = account?.user;
    if (!account?.passwordHash || !user) {
      throw new UnauthorizedException('유효하지 않은 자격 증명입니다.');
    }

    const passwordOk = await bcrypt.compare(dto.password, account.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('유효하지 않은 자격 증명입니다.');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('계정이 비활성화되었습니다.');
    }

    const payload = { sub: user.userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return LoginResponseDto.fromEntity(accessToken);
  }

  async resetPassword(userId: number, dto: ResetPasswordDto): Promise<void> {
    const user = await this.authAccountRepository.findOne({
      where: {
        user: { userId: userId },
        authProvider: AuthProvider.GENERAL,
      },
    });
    if (!user || !user.passwordHash) {
      throw new NotFoundException('계정 정보를 찾을 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const isSameAsBefore = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSameAsBefore) {
      throw new BadRequestException(
        '새 비밀번호는 이전 번호와 다르게 설정해야 합니다.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    user.passwordHash = hashedPassword;
    await this.authAccountRepository.save(user);
  }
}
