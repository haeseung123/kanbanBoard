import { ExceptionObjError } from 'src/global/enums/exception-obj-error.enum';
import { ExceptionObj } from 'src/global/interfaces/exception.obj';

export class TeamsException {
	static TEAM_NAME_ALREADY_EXISTS: ExceptionObj = {
		message: '이미 존재하는 팀명입니다.',
		error: ExceptionObjError.CONFLICT,
	};
	static TEAM_ALREADY_CREATED: ExceptionObj = {
		message: '기존에 생성한 팀이 존재합니다.',
		error: ExceptionObjError.CONFLICT,
	};
	static TEAM_INVITE_FORBIDDEN: ExceptionObj = {
		message: '초대 권한이 없는 사용자입니다.',
		error: ExceptionObjError.FORBIDDEN,
	};
	static ALREADY_INVITED_USER: ExceptionObj = {
		message: '이미 초대된 사용자 입니다.',
		error: ExceptionObjError.CONFLICT,
	};
	static NO_INVITED: ExceptionObj = {
		message: '초대받지 않은 사용자 입니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
	static ALREADY_ACCEPTED: ExceptionObj = {
		message: '이미 승낙하셧습니다.',
		error: ExceptionObjError.BAD_REQUEST,
	};
}
