import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export class InviteUserDto extends PickType(CreateUserDto, ['account']) {}
