import { createZodDto } from 'nestjs-zod';
import { loginSchema, signupSchema, changePasswordSchema } from '@repo/schemas';

export class SignupRequestDto extends createZodDto(signupSchema) {}
export class LoginRequestDto extends createZodDto(loginSchema) {}
export class ResetPasswordDto extends createZodDto(changePasswordSchema) {}
