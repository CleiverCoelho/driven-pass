import { BadRequestException, Body, Controller, Delete, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { EraseUserDataDto } from './dtos/erase-user-data-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("erase")
@Controller('erase')
export class EraseController {
    constructor(private readonly eraseService: EraseService) { }

    @Delete()
    @ApiBody({ type: EraseUserDataDto })
    @ApiOperation({ summary: "erases all your credentials, notes, cards information and delete your account"})
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
    @UseGuards(AuthGuard)
    delete(@Body() body: EraseUserDataDto, @User() user : UserPrisma) {
        const { password } = body;
        if(!password) throw new BadRequestException();
        return this.eraseService.eraseAll(password, user);
    }
}
