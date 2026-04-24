import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './users.request.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
