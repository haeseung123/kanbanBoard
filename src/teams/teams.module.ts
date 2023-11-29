import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Invitation } from './entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([Team, Invitation, User])],
	controllers: [TeamsController],
	providers: [TeamsService, UsersService, AuthService, JwtService],
})
export class TeamsModule {}
