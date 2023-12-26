import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateColumnDto } from './create-column.dto';

export class UpdateColumnDto extends CreateColumnDto {
	@ApiProperty({ description: '컬럼 ID' })
	@IsNotEmpty({ message: '수정을 위한 컬럼 ID는 필수 입력필드입니다.' })
	@IsNumber()
	column_id: number;
}
