import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: '태그 이름을 입력해주세요.' })
  @MaxLength(50, { message: '태그 이름은 50자 이하로 입력해주세요.' })
  name: string;

  @IsOptional()
  @IsString()
  // # + 6자리 16진수 패턴 검증 (예: #FFFFFF)
  @Matches(/^#([0-9A-Fa-f]{6})$/, {
    message: '올바른 색상 코드 형식이 아닙니다.',
  })
  color?: string;
}
