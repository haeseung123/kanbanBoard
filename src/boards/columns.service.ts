import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from './entities/boardColumn.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateColumnDto } from './dtos/create-column.dto';
import { TeamsService } from 'src/teams/teams.service';
import { UpdateColumnDto } from './dtos/update-column.dto';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';
import { BoardException } from './classes/board.exception.message';
import { DeleteColumnDto } from './dtos/delete-column.dto';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class ColumnsService {
	constructor(
		@InjectRepository(BoardColumn)
		private readonly boardColumnRepository: Repository<BoardColumn>,
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
		private readonly teamsService: TeamsService,
	) {}

	private async isColumnExistName(teamId: number, title: string) {
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
		return await this.boardColumnRepository.findOne({ where: options, relations: ['team'] });
	}

	private async validateColumnAndTeam(columnId: number, teamId: number) {
		const foundColumn = await this.findColumn({ id: columnId });

		if (!foundColumn) throw new BadRequestException(BoardException.COLUMN_NOT_EXISTS);
		if (foundColumn.team.id !== teamId) throw new BadRequestException(BoardException.NOT_TEAMS_COLUMN);

		return foundColumn;
	}

	async updateColumn(teamId: number, updateColumnDto: UpdateColumnDto) {
		const { column_id, title } = updateColumnDto;

		const column = await this.validateColumnAndTeam(column_id, teamId);

		const result = await this.boardColumnRepository.update(column.id, { title: title });
		return result.affected ? true : false;
	}

	async changeColumnOrder(teamId: number, updateColumnOrderDto: UpdateColumnOrderDto) {
		const { column_id, order } = updateColumnOrderDto;

		await this.validateColumnAndTeam(column_id, teamId);

		const columns = await this.boardColumnRepository.find({ where: { team: { id: teamId } } });

		return await this.updateEntityOrder(this.boardColumnRepository, columns, column_id, order);
	}

	async deleteColumn(teamId: number, deleteColumnDto: DeleteColumnDto) {
		const { column_id } = deleteColumnDto;

		await this.validateColumnAndTeam(column_id, teamId);

		const deletedColumn = await this.findColumn({ id: column_id });
		const deletedOrder = deletedColumn.order;

		const hasTickets = await this.ticketRepository.findOne({
			where: {
				boardColumn: { id: column_id },
			},
		});

		if (hasTickets !== null) throw new BadRequestException(BoardException.TICKET_EXIST_TO_COLUMN);

		await this.boardColumnRepository.delete({ id: column_id });

		const remainingColumns = await this.boardColumnRepository.find({
			where: {
				team: { id: teamId },
			},
			order: { order: 'ASC' },
		});

		for (const column of remainingColumns) {
			if (column.order > deletedOrder) {
				column.order--;
				await this.boardColumnRepository.update(column.id, { order: column.order });
			}
		}
	}

	async updateEntityOrder<T extends { id: number; order: number }>(
		repository: Repository<T>,
		entities: (DeepPartial<T> & T)[],
		entityId: number,
		newOrder: number,
	) {
		if (newOrder <= 0) {
			newOrder = 1;
		}

		const indexToEntity = entities.findIndex((e) => e.id === entityId);
		const { order: oldOrder } = entities[indexToEntity];

		entities[indexToEntity].order = newOrder;

		entities.forEach((entity) => {
			if (entity.id !== entityId) {
				if (newOrder > oldOrder) {
					if (entity.order > oldOrder && entity.order <= newOrder) {
						entity.order--;
					}
				} else {
					if (entity.order < oldOrder && entity.order >= newOrder) {
						entity.order++;
					}
				}
			}
		});

		return await repository.save(entities);
	}
}
