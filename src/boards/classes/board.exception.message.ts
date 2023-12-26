import { ExceptionObjError } from 'src/global/enums/exception-obj-error.enum';
import { ExceptionObj } from 'src/global/interfaces/exception.obj';

export class BoardException {
	static NOT_TEAM_LEADER: ExceptionObj = {
		message: '팀 리더가 아닙니다.',
		error: ExceptionObjError.FORBIDDEN,
	};
	static TEAM_ACCESS_FORBIDDEN: ExceptionObj = {
		message: '해당 팀 소속이 아닙니다.',
		error: ExceptionObjError.FORBIDDEN,
	};
	static NOT_BELONG_TEAM: ExceptionObj = {
		message: '소속된 팀이 없습니다.',
		error: ExceptionObjError.FORBIDDEN,
	};
	static COLUMN_ALREADY_EXISTS: ExceptionObj = {
		message: '이미 존재하는 컬럼입니다.',
		error: ExceptionObjError.CONFLICT,
	};
	static COLUMN_NOT_EXISTS: ExceptionObj = {
		message: '존재하지 않는 컬럼입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static SAME_COLUMN_VALUE: ExceptionObj = {
		message: '컬럼값이 동일합니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static TICKET_EXIST_TO_COLUMN: ExceptionObj = {
		message: '컬럼에 티켓이 존재하므로 삭제할 수 없습니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}
