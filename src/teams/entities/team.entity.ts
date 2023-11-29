import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/global/entities/base.entity';

@Entity()
export class Team extends BaseEntity {
	@Column()
	team_name: string;
}
