import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class ChangeUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  profileImage: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
