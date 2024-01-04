import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { TicketTag } from '../enums/ticket-tag.enum';

export class CreateTicketDto {
	@ApiProperty({ description: '컬럼 아이디' })
	@IsNotEmpty({ message: '컬럼 아이디는 필수 입력 필드입니다.' })
	column_id: number;

	@ApiProperty({ description: '티켓 제목' })
	@IsNotEmpty({ message: '제목은 필수 입력 필드입니다.' })
	title: string;

	@ApiProperty({ description: '태그' })
	@IsEnum(TicketTag, { message: '태그는 [Frontend, Backend, Design, QA, PM, Document] 중 하나여야 합니다.' })
	@IsNotEmpty({ message: '태그는 필수 입력 필드입니다.' })
	tag: TicketTag;

	@ApiProperty({ description: '작업기한' })
	@Matches(/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/, {
		message: 'year_month 필드는 YYYY-MM-DD 형식의 문자열이어야 합니다.',
	})
	@IsNotEmpty({ message: '작업기한은 필수 입력 필드입니다.' })
	due_date: string;

	@ApiProperty({ description: '작업분량' })
	workload: number;
}
