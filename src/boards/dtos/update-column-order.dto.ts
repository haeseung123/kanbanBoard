import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateColumnDto } from './update-column.dto';

export class UpdateColumnOrderDto extends PickType(UpdateColumnDto, ['column_id']) {
	@ApiProperty({ description: '컬럼 순서' })
	@IsNotEmpty({ message: '컬럼 순서는 필수 입력 필드입니다.' })
	@IsNumber()
	order: number;
}
