import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateTicketDto } from './update-ticket.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTicketOrderDto extends PickType(UpdateTicketDto, ['ticket_id']) {
	@ApiProperty({ description: '컬럼 ID' })
	@IsNotEmpty({ message: '컬럼 ID는 필수 입력 필드입니다.' })
	@IsNumber()
	column_id: number;

	@ApiProperty({ description: '티켓 순서' })
	@IsNotEmpty({ message: '티켓 순서는 필수 입력 필드입니다.' })
	@IsNumber()
	order: number;
}
