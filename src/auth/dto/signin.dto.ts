import { IsNotEmpty, IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;

}