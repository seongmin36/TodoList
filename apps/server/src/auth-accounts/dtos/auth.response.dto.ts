import { createZodDto } from 'nestjs-zod';
import { signUpResponseSchema } from '@repo/schemas';
import { User } from '@/users/entities/user.entity';

export class SignUpResponseDto extends createZodDto(signUpResponseSchema) {
  constructor(partial: Partial<SignUpResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  static fromEntity(user: User): SignUpResponseDto {
    return new SignUpResponseDto({
      id: user.userId,
      name: user.name,
    });
  }
}
