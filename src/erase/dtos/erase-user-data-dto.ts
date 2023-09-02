import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class EraseUserDataDto {
    @IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    password: string
}
