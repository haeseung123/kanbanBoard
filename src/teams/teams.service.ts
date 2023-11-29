import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UsersService } from 'src/users/users.service';
import { TeamsException } from './classes/team.exception.message';
import { InviteUserDto } from './dtos/invite-user.dto';
import { UsersException } from 'src/users/classes/user.exception.message';
import { InvitationStatus } from './enums/invitation-status.enum';

@Injectable()
export class TeamsService {
	constructor(
		@InjectRepository(Team)
		private readonly teamRepository: Repository<Team>,
		@InjectRepository(Invitation)
		private readonly invitaionRepository: Repository<Invitation>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly usersService: UsersService,
	) {}

	async isTeamExist(options: FindOptionsWhere<Team>): Promise<boolean> {
		return this.teamRepository.exist({ where: options });
	}

	async isInvitationExist(options: FindOptionsWhere<Invitation>): Promise<boolean> {
		return this.invitaionRepository.exist({ where: { invited_user: { id: options.id } } });
	}

	async findInvitaion(options: FindOptionsWhere<Invitation>): Promise<Invitation> {
		return this.invitaionRepository.findOne({ where: { invited_user: { id: options.id } } });
	}

	// async findTeam(options: FindOptionsWhere<Team>): Promise<Team> {
	// 	return await this.teamRepository.findOne({ where: options });
	// }

	// 초대된 사용자인 경우 팀을 생성할 수 없음
	async createTeam(createTeamDto: CreateTeamDto, user: User) {
		const { team_name } = createTeamDto;

		const isExist = await this.isTeamExist({ team_name });
		if (isExist) throw new ConflictException(TeamsException.TEAM_NAME_ALREADY_EXISTS);

		const newTeam = this.teamRepository.create({
			team_name,
		});

		const savedTeam = await this.teamRepository.save(newTeam);

		if (user.is_leader) throw new ConflictException(TeamsException.TEAM_ALREADY_CREATED);

		await this.userRepository.update({ id: user.id }, { is_leader: true, team: savedTeam });

		return {
			savedTeam,
			user,
		};
	}

	// 본인이 본인을 초대하는 경우도 생각해야함
	// 나 이외의 다른 팀장들일경우도 예외해야함
	async inviteUser(inviteUserDto: InviteUserDto, user: User) {
		if (!user.is_leader) throw new ForbiddenException(TeamsException.TEAM_INVITE_FORBIDDEN);

		const userWithTeam = await this.userRepository.findOne({ where: { id: user.id }, relations: ['team'] });

		const { account } = inviteUserDto;

		const findUser = await this.usersService.findUser({ account });
		if (!findUser) throw new BadRequestException(UsersException.USER_NOT_EXISTS);

		const isExist = await this.isInvitationExist(findUser);
		if (isExist) throw new ConflictException(TeamsException.ALREADY_INVITED_USER);

		const newInvitaion = this.invitaionRepository.create({
			inviter: user,
			invited_user: findUser,
			team: userWithTeam.team,
		});

		return await this.invitaionRepository.save(newInvitaion);
	}

	//나중에 거절 로직도 짜기
	async acceptInvitaion(user: User) {
		const foundInvitaion = await this.invitaionRepository.findOne({
			where: { invited_user: { id: user.id } },
			relations: ['team'],
		});

		if (!foundInvitaion) throw new BadRequestException(TeamsException.NO_INVITED);
		if (foundInvitaion.status === InvitationStatus.ACCEPTED) {
			throw new BadRequestException(TeamsException.ALREADY_ACCEPTED);
		}

		await this.invitaionRepository.update({ id: foundInvitaion.id }, { status: InvitationStatus.ACCEPTED });

		await this.userRepository.update({ id: user.id }, { team: foundInvitaion.team });

		return {
			user,
			foundInvitaion,
		};
	}
}
