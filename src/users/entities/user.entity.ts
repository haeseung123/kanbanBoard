import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/global/entities/base.entity';
import { Team } from 'src/teams/entities/team.entity';

@Entity()
export class User extends BaseEntity {
	@Column()
	account: string;

	@Column()
	@Exclude()
	password: string;

	@Column()
	username: string;

	@Column({ nullable: true })
	@Exclude()
	refresh_token: string;

	@Column({ type: 'boolean', default: false })
	is_leader: boolean;

	@ManyToOne(() => Team)
	@JoinColumn({ name: 'team_id' })
	team: Team;
}
