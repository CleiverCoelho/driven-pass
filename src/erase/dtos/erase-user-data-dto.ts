import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class EraseUserDataDto {
    @IsStrongPassword()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "Str0ng&estPa$$word!",
        description: "you need to confirm your registered password"
    })
    password: string
}
