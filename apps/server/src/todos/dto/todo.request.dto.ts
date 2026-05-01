import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RecurrenceType } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueAt?: Date;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsOptional()
  @IsBoolean()
  isDone?: boolean;
}

export class GetTodosRequestDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isDone?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueTo?: Date;

  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrenceType?: RecurrenceType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  onlyRecurring?: boolean;
}

export class UpdateRecurrenceDto {
  @IsOptional()
  @IsEnum(RecurrenceType, { message: '유효한 반복 주기가 아닙니다' })
  recurrenceType?: RecurrenceType;

  @IsOptional()
  @IsISO8601({}, { message: '유효한 시작 날짜 형식이 아닙니다.' })
  recurrenceStartAt?: Date;

  @IsOptional()
  @IsISO8601({}, { message: '유효한 종료 날짜 형식이 아닙니다.' })
  recurrenceEndAt?: Date;
}

export class UpdateTodoTagsDto {
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];
}
