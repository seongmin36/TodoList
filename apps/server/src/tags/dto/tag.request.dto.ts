import { createZodDto } from 'nestjs-zod';
import { createTagSchema, updateTagSchema } from '@repo/schemas';

export class CreateTagDto extends createZodDto(createTagSchema) {}
export class UpdateTagDto extends createZodDto(updateTagSchema) {}
