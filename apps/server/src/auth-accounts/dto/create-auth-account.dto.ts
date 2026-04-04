import { User } from '@/users/entities/user.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpResponseDto {
  users_id: number;
  name: string;

  static fromEntity(user: User): SignUpResponseDto {
    const dto = new SignUpResponseDto();
    dto.users_id = user.users_id;
    dto.name = user.name;
    return dto;
  }
}
