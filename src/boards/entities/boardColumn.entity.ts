import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/global/entities/base.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class BoardColumn extends BaseEntity {
	@Column()
	title: string;

	@Column()
	order: number;

	@ManyToOne(() => Team)
	@JoinColumn({ name: 'team_id' })
	team: Team;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'created_user_id' })
	created_user: User;
}
