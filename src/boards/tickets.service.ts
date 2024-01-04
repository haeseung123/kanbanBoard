import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { User } from 'src/users/entities/user.entity';
import { ColumnsService } from './columns.service';
import { BoardException } from './classes/board.exception.message';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { UpdateTicketOrderDto } from './dtos/update-ticket-order.dto';
import { BoardColumn } from './entities/boardColumn.entity';
import { DeleteTicketDto } from './dtos/delete-ticket.dto';

@Injectable()
export class TicketsService {
	constructor(
		@InjectRepository(Ticket)
		private readonly ticketRepository: Repository<Ticket>,
		private readonly columnsService: ColumnsService,
	) {}

	async isTicketExist(options: FindOptionsWhere<Ticket>): Promise<boolean> {
		return this.ticketRepository.exist({ where: options });
	}

	private async getTicketCount(columnId: number) {
		return await this.ticketRepository.count({
			where: { boardColumn: { id: columnId } },
		});
	}

	//팀 아이디가 필요없을거같애 왜냐면 컬럼 아이디는 고유의 값이니깐
	async createTicket(teamId: number, user: User, createTicketDto: CreateTicketDto) {
		const { column_id, title, tag, due_date, workload } = createTicketDto;

		const column = await this.columnsService.findColumn({ id: column_id });
		if (!column) throw new BadRequestException(BoardException.COLUMN_NOT_EXISTS);

		const count = await this.getTicketCount(column.id);

		const newTicket = this.ticketRepository.create({
			title,
			tag,
			due_date,
			workload,
			order: count + 1,
			boardColumn: column,
			assignee: user,
		});

		return await this.ticketRepository.save(newTicket);
	}

	async updateTicket(updateTicketDto: UpdateTicketDto) {
		const { ticket_id, ...newInput } = updateTicketDto;

		const isExist = await this.isTicketExist({ id: ticket_id });
		if (!isExist) throw new BadRequestException(BoardException.TICKET_NOT_EXISTS);

		await this.ticketRepository.update(
			{ id: ticket_id },
			{
				...newInput,
			},
		);

		return true;
	}

	async changeTicketOrder(updateTicketOrderDto: UpdateTicketOrderDto) {
		const { ticket_id, column_id, order } = updateTicketOrderDto;

		const foundTicket = await this.ticketRepository.findOne({
			where: { id: ticket_id },
			relations: ['boardColumn'],
		});

		const column = await this.columnsService.findColumn({ id: column_id });
		if (!column) throw new BadRequestException(BoardException.COLUMN_NOT_EXISTS);

		if (foundTicket.boardColumn.id === column_id) {
			// 동일한 컬럼내에서의 순서 변경
			await this.changeTicketOrderInSameColumn(foundTicket, order);
		} else {
			// 다른 컬럼으로의 이동
			await this.moveTicketToAnotherColumn(foundTicket, column, order);
		}

		return;
	}

	private async changeTicketOrderInSameColumn(ticket: Ticket, newOrder: number) {
		const { boardColumn, order: oldOrder } = ticket;
		const columnId = boardColumn.id;

		if (newOrder <= 0) {
			newOrder = 1;
		}

		let tickets = await this.ticketRepository.find({ where: { boardColumn: { id: columnId } } });

		const indexToTicket = tickets.findIndex((c) => c.id === ticket.id);

		tickets[indexToTicket].order = newOrder;

		tickets.forEach((t) => {
			if (t.id !== ticket.id) {
				if (newOrder > oldOrder) {
					if (t.order > oldOrder && t.order <= newOrder) {
						t.order--;
					}
				} else {
					if (t.order < oldOrder && t.order >= newOrder) {
						t.order++;
					}
				}
			}
		});

		await this.ticketRepository.save(tickets);
	}

	private async moveTicketToAnotherColumn(ticket: Ticket, newColumn: BoardColumn, newOrder: number) {
		const oldColumnId = ticket.boardColumn.id;
		const oldOrder = ticket.order;

		await this.ticketRepository.update(ticket.id, { boardColumn: null });

		const ticketsInNewColumn = await this.ticketRepository.find({
			where: { boardColumn: { id: newColumn.id } },
			order: { order: 'ASC' },
		});

		ticketsInNewColumn.forEach((t) => {
			if (newOrder <= 0) {
				newOrder = 1;
			}

			if (t.order >= newOrder) {
				t.order++;
			}
		});

		await this.ticketRepository.save(ticketsInNewColumn);

		const ticketsInOldColumn = await this.ticketRepository.find({
			where: { boardColumn: { id: oldColumnId } },
			order: { order: 'ASC' },
		});

		ticketsInOldColumn.forEach((t) => {
			if (t.order > oldOrder) {
				t.order--;
			}
		});

		await this.ticketRepository.save(ticketsInOldColumn);

		await this.ticketRepository.update(ticket.id, {
			boardColumn: { id: newColumn.id },
			order: newOrder,
		});
	}

	async deleteTicket(deleteTicketDto: DeleteTicketDto) {
		const { ticket_id } = deleteTicketDto;

		const isExist = await this.isTicketExist({ id: ticket_id });
		if (!isExist) throw new BadRequestException(BoardException.TICKET_NOT_EXISTS);

		await this.ticketRepository.delete({ id: ticket_id });
	}
}
