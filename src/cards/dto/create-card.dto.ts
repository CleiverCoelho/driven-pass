import { ApiProperty } from "@nestjs/swagger"
import { CardTypes } from "@prisma/client"
import { IsBoolean, IsNotEmpty, IsNumberString, IsString, Length, Matches, isDate, matches } from "class-validator"

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "GoogleCard"
      })
    title : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "My name"
      })
    name : string

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({
        example: "1111222233334444"
      })
    number : string

    // regex para formato de data YYYY/MM
    @IsNotEmpty()
    @Matches(/^\d{4}[-.\/](0[1-9]|1[0-2])$/)
    @ApiProperty({
        example: "2030-10",
        description: "must be valid date"
    })
    expirationDate: string;

    @IsNumberString()
    @Length(3)
    @IsNotEmpty()
    @ApiProperty({
        example: "123"
    })
    cvv : string

    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty({
        example: "My_Card_Password"
    })
    password : string

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        example: false,
        description: "boolean value: true/false"
    })
    isVirtual : boolean

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "CREDIT",
        description: "only accepts: (CREDIT, DEBIT, BOTH) values"
    })
    type : CardTypes
}
