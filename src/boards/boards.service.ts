import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entities/boardColumn.entity';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateColumnDto } from './dtos/create-column.dto';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(BoardColumn)
		private readonly boardColumnRepository: Repository<BoardColumn>,
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
	) {}
}
