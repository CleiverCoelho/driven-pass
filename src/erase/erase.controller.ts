import { BadRequestException, Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { EraseService } from './erase.service';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { EraseUserDataDto } from './dtos/erase-user-data-dto';

@Controller('erase')
export class EraseController {
    constructor(private readonly eraseService: EraseService) { }

    @Delete()
    @UseGuards(AuthGuard)
    delete(@Body() body: EraseUserDataDto, @User() user : UserPrisma) {
        const { password } = body;
        if(!password) throw new BadRequestException();
        return this.eraseService.eraseAll(password, user);
    }
}
