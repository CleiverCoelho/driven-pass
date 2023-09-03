import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export default class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: "example@example.com"
  })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    example: "Str0ng&estPa$$word!"
  })
  password: string;
}
