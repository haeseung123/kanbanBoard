import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/global/entities/base.entity';
import { BoardColumn } from './boardColumn.entity';
import { User } from 'src/users/entities/user.entity';
import { TicketTag } from '../enums/ticket-tag.enum';

@Entity()
export class Ticket extends BaseEntity {
	@Column()
	title: string;

	@Column({
		type: 'enum',
		enum: TicketTag,
		nullable: true,
	})
	tag: TicketTag;

	@Column({
		type: 'numeric',
		precision: 5,
		scale: 1,
	})
	workload: number;

	@Column()
	due_date: string;

	@Column()
	assignee: string;

	@Column()
	order: number;

	@ManyToOne(() => BoardColumn)
	@JoinColumn({ name: 'board_column_id' })
	boardColumn: BoardColumn;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'created_user_id' })
	created_user: User;
}
