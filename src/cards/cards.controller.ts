import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma} from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("cards")
@ApiBearerAuth()
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiBody({ type: CreateCardDto })
  @ApiOperation({ summary: "creates a card info note"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @UseGuards(AuthGuard)
  create(@Body() createCardDto: CreateCardDto, @User() user : UserPrisma) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns all users registered cards"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  findAll(@User() user : UserPrisma) {
    const { id } = user;
    return this.cardsService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns an especific registered card"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to access another users card"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to access a card that does not exist"})
  findOne(@Param('id') id: string, @User() user : UserPrisma) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "deletes an especific registered card"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to delete another users card"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to delete a card that does not exist"})
  remove(@Param('id') id: string, @User() user : UserPrisma) {
    return this.cardsService.remove(+id, user);
  }
}
