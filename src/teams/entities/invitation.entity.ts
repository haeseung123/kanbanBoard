import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/global/entities/base.entity';
import { InvitationStatus } from '../enums/invitation-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Team } from './team.entity';

@Entity()
export class Invitation extends BaseEntity {
	@Column({
		type: 'enum',
		enum: InvitationStatus,
		default: 'pending',
	})
	status: InvitationStatus;

	@OneToOne(() => User)
	@JoinColumn({ name: 'inviter_id' })
	inviter: User;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'invited_user_id' })
	invited_user: User;

	@ManyToOne(() => Team)
	@JoinColumn({ name: 'team_id' })
	team: Team;
}
