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

	async findUserInTeam(options: FindOptionsWhere<User>): Promise<User> {
		return this.userRepository.findOne({ where: { id: options.id }, relations: ['team'] });
	}

	async findTeam(options: FindOptionsWhere<Team>): Promise<Team> {
		return await this.teamRepository.findOne({ where: options });
	}

	async createTeam(createTeamDto: CreateTeamDto, user: User) {
		const { team_name } = createTeamDto;

		const isInvited = await this.invitaionRepository.exist({ where: { invited_user: { id: user.id } } });
		if (isInvited) throw new ForbiddenException(TeamsException.TEAM_CREATE_FORBIDDEN);

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

	async inviteUser(inviteUserDto: InviteUserDto, user: User) {
		if (!user.is_leader) throw new ForbiddenException(TeamsException.TEAM_INVITE_FORBIDDEN);

		const foundUserInTeam = await this.findUserInTeam(user);

		const { account } = inviteUserDto;

		const findUser = await this.usersService.findUser({ account });
		if (!findUser) throw new BadRequestException(UsersException.USER_NOT_EXISTS);

		if (user.id === findUser.id) throw new BadRequestException(TeamsException.UNABLE_INVITE_YOUR_SELF);
		if (findUser.is_leader) throw new BadRequestException(TeamsException.UNABLE_INVITE_TEAM_LEADER);

		const isExist = await this.isInvitationExist(findUser);
		if (isExist) throw new ConflictException(TeamsException.ALREADY_INVITED_USER);

		const newInvitation = this.invitaionRepository.create({
			inviter: user,
			invited_user: findUser,
			team: foundUserInTeam.team,
		});

		return await this.invitaionRepository.save(newInvitation);
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
