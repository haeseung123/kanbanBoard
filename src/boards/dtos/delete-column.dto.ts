import { PickType } from '@nestjs/mapped-types';
import { UpdateColumnDto } from './update-column.dto';

export class DeleteColumnDto extends PickType(UpdateColumnDto, ['column_id']) {}
