import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export default class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;
}
