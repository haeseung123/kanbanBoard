import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
// import { CommonErrorResponseDto } from '../dtos/common-error-response.dto';
// import { HttpExceptionResponseDto } from '../dtos/http-exception-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const exceptionObj = exception.getResponse(); // ExceptionObj 타입의 객체

		// const errorTest: CommonErrorResponseDto<HttpExceptionResponseDto> = {
		// 	success: false,
		// 	statusCode: status,
		// 	error: exceptionObj['error'],
		// 	message: exceptionObj['message'],
		// 	timestamp: new Date().toISOString(), // 2023-10-27T14:30:20.123Z
		// 	path: request.url,
		// };

		// response.status(status).json(errorTest);

		response.status(status).json({
			success: false,
			statusCode: status,
			error: exceptionObj['error'],
			message: exceptionObj['message'],
			timestamp: new Date().toISOString(), // 2023-10-27T14:30:20.123Z
			path: request.url,
		});
	}
}
