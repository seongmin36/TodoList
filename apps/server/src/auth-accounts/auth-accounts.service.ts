import {
  ConflictException,
  Injectable,
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
        auth_provider: AuthProvider.GENERAL,
        provider_user_id: dto.email,
      },
    });
    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      profile_img: null,
      is_active: true,
    });
    const savedUser = await this.userRepository.save(user);

    const authAccount = this.authAccountRepository.create({
      user: savedUser,
      auth_provider: AuthProvider.GENERAL,
      provider_user_id: dto.email,
      password_hash: passwordHash,
    });
    await this.authAccountRepository.save(authAccount);

    return savedUser;
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const account = await this.authAccountRepository.findOne({
      where: {
        auth_provider: AuthProvider.GENERAL,
        provider_user_id: dto.email,
      },
      relations: ['user'],
    });

    const user = account?.user;
    if (!account?.password_hash || !user) {
      throw new UnauthorizedException('유효하지 않은 자격 증명입니다.');
    }

    // 비밀번호 검증
    const passwordOk = await bcrypt.compare(
      dto.password,
      account.password_hash,
    );
    // 비밀번호가 일치하지 않으면 예외 발생
    if (!passwordOk) {
      throw new UnauthorizedException('유효하지 않은 자격 증명입니다.');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('계정이 비활성화되었습니다.');
    }

    const payload = { sub: user.users_id };
    const accessToken = await this.jwtService.signAsync(payload);

    return LoginResponseDto.fromEntity(accessToken);
  }
}
