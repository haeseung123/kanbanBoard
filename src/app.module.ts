import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './global/configs/validation.schema';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { BoardsModule } from './boards/boards.module';
import jwtConfiguration from './global/configs/jwt.configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [jwtConfiguration],
			envFilePath: `.${process.env.NODE_ENV}.env`,
			validationSchema,
		}),
		DatabaseModule,
		UsersModule,
		TeamsModule,
		BoardsModule,
	],
})
export class AppModule {}
