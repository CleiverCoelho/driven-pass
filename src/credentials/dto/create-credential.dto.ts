import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsUrl()
    @IsNotEmpty()
    url : string

    @IsString()
    @IsNotEmpty()
    username : string

    @IsString()
    @IsNotEmpty()
    password : string

    @IsString()
    @IsNotEmpty()
    title : string
}
