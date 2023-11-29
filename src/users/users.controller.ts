import { Body, Controller, HttpCode, Post, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { UserResponseMessage } from './classes/user.response.message';
import { LoginUserDto } from './dtos/login-user.dto';
import { AtGuard } from 'src/auth/guard/access.token.guard';
import { User } from './entities/user.entity';
import { RtGuard } from 'src/auth/guard/refresh.token.guard';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';

@ApiTags('유저')
@Controller('users')
@UseFilters(HttpExceptionFilter, JwtExceptionFilter)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: '회원가입' })
	// @ApiResponse({
	// 	status: 201,
	// 	description: '회원가입 성공',
	// })
	// @ApiResponse({
	// 	status: 400,
	// 	description: '필드값 에러',
	// })
	// @ApiResponse({
	// 	status: 409,
	// 	description: '이미 존재하는 계정',
	// })
	@Post('signup')
	@ResponseMessage(UserResponseMessage.SIGN_UP)
	async signUp(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.createUser(createUserDto);
	}

	@ApiOperation({ summary: '로그인' })
	@Post('login')
	@ResponseMessage(UserResponseMessage.LOG_IN)
	async login(@Body() loginUserDto: LoginUserDto) {
		return await this.usersService.loginUser(loginUserDto);
	}

	@ApiOperation({ summary: '로그아웃' })
	@Post('logout')
	@UseGuards(AtGuard)
	@HttpCode(204)
	async logout(@GetUser() user: User) {
		await this.usersService.logout(user);
	}

	@ApiOperation({ summary: '엑세스 토큰 재발급' })
	@Post('refresh')
	@UseGuards(RtGuard)
	@ResponseMessage(UserResponseMessage.REFRESH)
	async refresh(@GetUser() user: User) {
		return await this.usersService.refresh(user);
	}
}
