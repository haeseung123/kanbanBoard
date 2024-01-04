import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entities/boardColumn.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateColumnDto } from './dtos/create-column.dto';
import { TeamsService } from 'src/teams/teams.service';
import { UpdateColumnDto } from './dtos/update-column.dto';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';
import { BoardException } from './classes/board.exception.message';
import { DeleteColumnDto } from './dtos/delete-column.dto';

@Injectable()
export class ColumnsService {
	constructor(
		@InjectRepository(BoardColumn)
		private readonly boardColumnRepository: Repository<BoardColumn>,
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
		private readonly teamsService: TeamsService,
	) {}

	async isColumnExistName(teamId: number, title: string) {
		// console.log(teamId, title);
		return this.boardColumnRepository.exist({
			where: { team: { id: teamId }, title },
		});
	}

	private async getColumnCount(teamId: number) {
		return await this.boardColumnRepository.count({
			where: { team: { id: teamId } },
		});
	}

	async createColumn(teamId: number, user: User, createColumnDto: CreateColumnDto) {
		const { title } = createColumnDto;

		const foundTeam = await this.teamsService.findTeam({ id: teamId });

		const isColumnExistName = await this.isColumnExistName(teamId, title);
		if (isColumnExistName) throw new ConflictException(BoardException.COLUMN_ALREADY_EXISTS);

		const count = await this.getColumnCount(teamId);

		const newColumn = this.boardColumnRepository.create({
			title,
			order: count + 1,
			team: foundTeam,
			created_user: user,
		});

		return await this.boardColumnRepository.save(newColumn);
	}

	async findColumn(options: FindOptionsWhere<BoardColumn>): Promise<BoardColumn | null> {
		return await this.boardColumnRepository.findOne({ where: options });
	}
	//팀의 컬럼인지 여부를 확인해야함, 나중에 가드로 빼도 될듯
	// 변경된 값을 return
	async updateColumn(teamId: number, updateColumnDto: UpdateColumnDto) {
		const { column_id, title } = updateColumnDto;

		const foundColumn = await this.findColumn({ id: column_id });

		if (!foundColumn) throw new BadRequestException(BoardException.COLUMN_NOT_EXISTS);

		await this.boardColumnRepository.update(foundColumn.id, { title: title });
		return foundColumn;
	}

	// 입력값이 만일 현재 컬럼 순서와 같으면 변화없음 order가 0이 아니여야함 이것은 dto에서 검증하는것으로 하자
	async changeColumnOrder(teamId: number, updateColumnOrderDto: UpdateColumnOrderDto) {
		const { column_id, order } = updateColumnOrderDto;

		let columns = await this.boardColumnRepository.find({ where: { team: { id: teamId } } });

		// if(!foundColumn) throw new BadRequestException('컬럼존재 x')
		const indexToColumn = columns.findIndex((c) => c.id === column_id);

		if (indexToColumn !== -1) {
			const oldOrder = columns[indexToColumn].order;
			if (oldOrder === order) throw new BadRequestException(BoardException.SAME_COLUMN_VALUE);

			columns[indexToColumn].order = order;

			columns.forEach((column) => {
				if (column.id !== column_id) {
					if (order > oldOrder) {
						if (column.order > oldOrder && column.order <= order) {
							column.order--;
						}
					} else {
						if (column.order < oldOrder && column.order >= order) {
							column.order++;
						}
					}
				}
			});

			// await this.boardColumnRepository.save(columns) 변경테스트 해보기~
			columns.forEach(async (column) => {
				await this.boardColumnRepository.update(column.id, { order: column.order });
			});

			columns.sort((a, b) => a.order - b.order);
		}

		return columns;
	}

	async deleteColumn(teamId: number, deleteColumnDto: DeleteColumnDto) {
		//팀의 컬럼이 맞는지 검증하기

		const { column_id } = deleteColumnDto;

		const hasTickets = await this.ticketRepository
			.createQueryBuilder('ticket')
			.leftJoinAndSelect('ticket.boardColumn', 'column')
			.where('ticket.board_column_id = :id', { id: column_id })
			.getOne();

		if (hasTickets !== null) throw new BadRequestException(BoardException.TICKET_EXIST_TO_COLUMN);

		await this.boardColumnRepository.delete({ id: column_id });
	}
}
