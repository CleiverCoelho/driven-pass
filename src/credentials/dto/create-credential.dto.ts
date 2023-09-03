import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsUrl()
    @IsNotEmpty()
    @ApiProperty({
        example: "https://facebook.com"
    })
    url : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "my_username"
    })
    username : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "my_password"
    })
    password : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "my facebook credential"
    })
    title : string
}
