import { PickType } from '@nestjs/mapped-types';
import { UpdateTicketDto } from './update-ticket.dto';

export class DeleteTicketDto extends PickType(UpdateTicketDto, ['ticket_id']) {}
