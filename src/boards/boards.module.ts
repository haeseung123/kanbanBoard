import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TeamsService } from 'src/teams/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from './entities/boardColumn.entity';
import { Ticket } from './entities/ticket.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Invitation } from 'src/teams/entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ColumnsService } from './columns.service';

@Module({
	imports: [TypeOrmModule.forFeature([BoardColumn, Ticket, Team, Invitation, User])],
	controllers: [BoardsController],
	providers: [BoardsService, TeamsService, UsersService, AuthService, JwtService, ColumnsService],
})
export class BoardsModule {}
