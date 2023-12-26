import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/access.token.guard';
import { BoardsService } from './boards.service';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TeamLeaderGuard } from 'src/global/guards/team-leader.guard';
import { CreateColumnDto } from './dtos/create-column.dto';
import { ColumnsService } from './columns.service';
import { UpdateColumnDto } from './dtos/update-column.dto';
import { UpdateColumnOrderDto } from './dtos/update-column-order.dto';
import { TeamMemberGuard } from 'src/global/guards/team-member.guard';
import { DeleteColumnDto } from './dtos/delete-column.dto';
import { JwtExceptionFilter } from 'src/global/filters/jwt-exception.filter';
import { HttpExceptionFilter } from 'src/global/filters/http-exception.filter';
import { ResponseMessage } from 'src/global/decorators/response-key.decorator';
import { BoardResponseMessage } from './classes/board.response.message';

@ApiTags('칸반보드')
@Controller('boards')
@UseGuards(AtGuard)
@UseFilters(HttpExceptionFilter, JwtExceptionFilter)
export class BoardsController {
	constructor(private readonly boardsService: BoardsService, private readonly columnsService: ColumnsService) {}

	@ApiOperation({ summary: '컬럼 생성' })
	@Post(':teamId/column')
	@UseGuards(TeamLeaderGuard)
	@ResponseMessage(BoardResponseMessage.CREATED_COLUMN)
	async create(
		@Param('teamId', ParseIntPipe) teamId: number,
		@GetUser() user: User,
		@Body() createColumnDto: CreateColumnDto,
	) {
		return await this.columnsService.createColumn(teamId, user, createColumnDto);
	}

	@ApiOperation({ summary: '컬럼 타이틀 수정' }) //팀원도 수정할 수 있음
	@Patch(':teamId/column')
	@UseGuards(TeamMemberGuard)
	@ResponseMessage(BoardResponseMessage.UPDATED_COLUMN_TITLE)
	async update(@Param('teamId', ParseIntPipe) teamId: number, @Body() updateColumnDto: UpdateColumnDto) {
		return await this.columnsService.updateColumn(teamId, updateColumnDto);
	}

	@ApiOperation({ summary: '컬럼 순서 변경' })
	@Patch(':teamId/column/order')
	@UseGuards(TeamMemberGuard)
	@ResponseMessage(BoardResponseMessage.UPDATED_COLUMN_ORTER)
	async changeOrder(
		@Param('teamId', ParseIntPipe) teamId: number,
		@Body() updateColumnOrderDto: UpdateColumnOrderDto,
	) {
		return await this.columnsService.changeColumnOrder(teamId, updateColumnOrderDto);
	}

	@ApiOperation({ summary: '컬럼 삭제' })
	@Delete(':teamId/column')
	@UseGuards(TeamLeaderGuard)
	@HttpCode(204)
	async DeleteDateColumn(@Param('teamId', ParseIntPipe) teamId: number, @Body() deleteColumnDto: DeleteColumnDto) {
		await this.columnsService.deleteColumn(teamId, deleteColumnDto);
	}

	// @ApiOperation({ summary: '전체 조회'})
	// @Get(':teamId')
	// @UseGuards(TeamMemberGuard)
	// async getColumns(@Param('teamId', ParseIntPipe) teamId: number) {
	// 	return await this.boardsService
	// }
}
