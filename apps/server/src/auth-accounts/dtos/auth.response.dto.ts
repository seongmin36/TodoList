import { User } from '@/users/entities/user.entity';

export class SignUpResponseDto {
  id: number;
  name: string;

  static fromEntity(user: User): SignUpResponseDto {
    const dto = new SignUpResponseDto();
    dto.id = user.userId;
    dto.name = user.name;
    return dto;
  }
}

export class LoginResponseDto {
  accessToken: string;
  tokenType: string;

  static fromEntity(
    accessToken: string,
    tokenType: string = 'Bearer',
  ): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.accessToken = accessToken;
    dto.tokenType = tokenType;
    return dto;
  }
}
