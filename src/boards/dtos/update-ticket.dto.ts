import { ApiProperty } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class UpdateTicketDto extends OmitType(CreateTicketDto, ['column_id']) {
	@ApiProperty({ description: '티켓 ID' })
	@IsNotEmpty({ message: '수정을 위한 티켓 ID는 필수 입력 필드입니다.' })
	ticket_id: number;
}
