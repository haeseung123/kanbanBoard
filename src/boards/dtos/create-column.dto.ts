import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateColumnDto {
	@ApiProperty({ description: '컬럼 제목' })
	@IsString()
	@IsNotEmpty({ message: '컬럼 제목은 필수 입력 필드입니다.' })
	@MaxLength(10, { message: '컬럼 제목은 10자 이내여야 합니다.' })
	title: string;
}
