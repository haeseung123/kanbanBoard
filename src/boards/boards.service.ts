import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entities/boardColumn.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
	constructor(
		@InjectRepository(BoardColumn)
		private readonly boardColumnRepository: Repository<BoardColumn>,
	) {}

	async findColumns(teamId: number) {
		const columns = await this.boardColumnRepository.find({
			where: { team: { id: teamId } },
			order: { order: 'ASC' },
			relations: ['tickets'],
		});

		columns.forEach((column) => {
			column.tickets.sort((a, b) => a.order - b.order);
		});

		return columns;
	}
}
