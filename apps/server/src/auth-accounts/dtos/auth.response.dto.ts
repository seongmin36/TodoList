import { User } from '@/users/entities/user.entity';

export class SignUpResponseDto {
  id: number;
  name: string;

  constructor(partial: Partial<SignUpResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(user: User): SignUpResponseDto {
    return new SignUpResponseDto({
      id: user.userId,
      name: user.name,
    });
  }
}

export class LoginResponseDto {
  accessToken: string;
  tokenType: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(
    accessToken: string,
    tokenType: string = 'Bearer',
  ): LoginResponseDto {
    return new LoginResponseDto({
      accessToken,
      tokenType,
    });
  }
}
