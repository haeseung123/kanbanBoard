import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
	@ApiProperty({ description: '팀명' })
	@IsString()
	@IsNotEmpty({ message: '팀명은 필수 입력 필드입니다.' })
	@MaxLength(10, { message: '팀명은 10자 이내여야 합니다.' })
	team_name: string;
}
