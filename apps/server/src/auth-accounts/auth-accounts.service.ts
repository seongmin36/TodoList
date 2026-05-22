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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '@/users/entities/user.entity';
import {
  SignupRequestDto,
  LoginRequestDto,
  ResetPasswordDto,
} from './dtos/index';
import { AuthAccount, AuthProvider } from './entities/auth-account.entity';

@Injectable()
export class AuthAccountsService {
  private static readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthAccount)
    private readonly authAccountRepository: Repository<AuthAccount>,
    private readonly jwtService: JwtService,
    @InjectPinoLogger(AuthAccountsService.name)
    private readonly logger: PinoLogger,
  ) {}

  private async validatePassword(
    plainPassword: string,
    passwordHash: string,
    errorMessage: string,
  ): Promise<void> {
    const isValid = await bcrypt.compare(plainPassword, passwordHash);

    if (!isValid) {
      throw new UnauthorizedException(errorMessage);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, AuthAccountsService.SALT_ROUNDS);
  }

  async signUp(dto: SignupRequestDto): Promise<User> {
    const existing = await this.authAccountRepository.findOne({
      where: {
        authProvider: AuthProvider.GENERAL,
        providerUserId: dto.email,
      },
    });
    if (existing) {
      this.logger.warn(
        { email: dto.email },
        '이미 등록된 이메일로 회원가입 시도',
      );
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const passwordHash = await this.hashPassword(dto.password);

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

    this.logger.debug({ userId: savedUser.userId }, '회원가입 완료');
    return savedUser;
  }

  async login(dto: LoginRequestDto): Promise<string> {
    const account = await this.authAccountRepository.findOne({
      where: {
        authProvider: AuthProvider.GENERAL,
        providerUserId: dto.email,
      },
      relations: ['user'],
    });

    const user = account?.user;
    if (!account?.passwordHash || !user) {
      this.logger.warn(
        { email: dto.email },
        '존재하지 않는 계정으로 로그인 시도',
      );
      throw new UnauthorizedException('유효하지 않은 자격 증명입니다.');
    }

    await this.validatePassword(
      dto.password,
      account.passwordHash,
      '비밀번호가 일치하지 않습니다.',
    );

    if (!user.isActive) {
      this.logger.warn({ userId: user.userId }, '비활성화된 계정 로그인 시도');
      throw new UnauthorizedException('계정이 비활성화되었습니다.');
    }

    const payload = { sub: user.userId };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.debug({ userId: user.userId }, '로그인 성공');
    return accessToken;
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

    await this.validatePassword(
      dto.currentPassword,
      user.passwordHash,
      '현재 비밀번호가 일치하지 않습니다.',
    );

    const isSameAsBefore = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSameAsBefore) {
      this.logger.warn({ userId }, '현재와 동일한 비밀번호로 변경 시도');
      throw new BadRequestException(
        '새 비밀번호는 이전 번호와 다르게 설정해야 합니다.',
      );
    }

    user.passwordHash = await this.hashPassword(dto.newPassword);
    await this.authAccountRepository.save(user);
    this.logger.debug({ userId }, '비밀번호 변경 완료');
  }
}
