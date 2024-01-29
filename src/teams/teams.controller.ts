import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/access.token.guard';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dtos/create-team.dto';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { InviteUserDto } from './dtos/invite-user.dto';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { TeamResponseMessage } from './classes/team.response.message';

@ApiTags('팀')
@Controller('teams')
@UseGuards(AtGuard)
@UseFilters(HttpExceptionFilter, JwtExceptionFilter)
export class TeamsController {
	constructor(private readonly teamsService: TeamsService) {}

	@ApiOperation({ summary: '팀 생성' })
	@Post('create')
	@ResponseMessage(TeamResponseMessage.CREATED_TEAM)
	async create(@Body() createTeamDto: CreateTeamDto, @GetUser() user: User) {
		return await this.teamsService.createTeam(createTeamDto, user);
	}

	@ApiOperation({ summary: '팀 초대' })
	@Post('invite')
	@ResponseMessage(TeamResponseMessage.INVITED_TEAM)
	async invite(@Body() inviteUserDto: InviteUserDto, @GetUser() user: User) {
		return await this.teamsService.inviteUser(inviteUserDto, user);
	}

	@ApiOperation({ summary: '팀 초대 승낙' })
	@Post('accept')
	@ResponseMessage(TeamResponseMessage.ACCEPTED_TEAM)
	async accepted(@GetUser() user: User) {
		return await this.teamsService.acceptInvitaion(user);
	}
}
