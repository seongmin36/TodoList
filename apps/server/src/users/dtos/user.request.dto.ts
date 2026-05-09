import { createZodDto } from 'nestjs-zod';
import { updateProfileSchema } from '@repo/schemas';

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
