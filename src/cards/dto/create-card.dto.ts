import { CardTypes } from "@prisma/client"
import { doesNotMatch } from "assert"
import { IsBoolean, IsDate, IsDateString, IsISO8601, IsNotEmpty, IsNumberString, IsString, Length, Matches, isDate, matches } from "class-validator"

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title : string

    @IsString()
    @IsNotEmpty()
    name : string

    @IsNumberString()
    @IsNotEmpty()
    number : string

    // regex para formato de data YYYY/MM
    @IsNotEmpty()
    @Matches(/^\d{4}[-.\/](0[1-9]|1[0-2])$/)
    expirationDate: string;

    @IsNumberString()
    @Length(3)
    @IsNotEmpty()
    cvv : string

    @IsNumberString()
    @IsNotEmpty()
    password : string

    @IsBoolean()
    @IsNotEmpty()
    isVirtual : boolean

    @IsString()
    @IsNotEmpty()
    type : CardTypes
}
