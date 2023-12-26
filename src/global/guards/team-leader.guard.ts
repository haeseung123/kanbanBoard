import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { BoardException } from 'src/boards/classes/board.exception.message';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class TeamLeaderGuard implements CanActivate {
	constructor(private readonly teamsService: TeamsService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const teamId = +context.getArgs()[0].params.teamId;

		if (!user.is_leader) throw new ForbiddenException(BoardException.NOT_TEAM_LEADER);

		const userInTeam = await this.teamsService.findUserInTeam(user);

		if (teamId !== userInTeam.team.id) throw new ForbiddenException(BoardException.TEAM_ACCESS_FORBIDDEN);
		return true;
	}
}
