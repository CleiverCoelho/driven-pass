import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';
import CreateUserDto from '../../users/dtos/login.dto';

export class SignUpDto extends CreateUserDto { }