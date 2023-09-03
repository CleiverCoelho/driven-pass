import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "money emergency"
    })
    title: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "call this number: +12 (12) 1212-1212"
    })
    content: string
}
