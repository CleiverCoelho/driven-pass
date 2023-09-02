import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma} from '@prisma/client';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCardDto: CreateCardDto, @User() user : UserPrisma) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user : UserPrisma) {
    const { id } = user;
    return this.cardsService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User() user : UserPrisma) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
