import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';
import { CardsRepository } from './cards.repository';
import * as bcrypt from "bcrypt";

@Injectable()
export class CardsService {
  private cryptr: Cryptr

  constructor(private readonly cardsRepository: CardsRepository) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
  }


  async create(createCardDto: CreateCardDto, user : User) {
    const { title, expirationDate, type } = createCardDto;
    const { id } = user;
    
    if(type !== "CREDIT" && type !== "DEBIT" && type !== "BOTH") throw new BadRequestException();

    const todaysDate = new Date();
    if(new Date(expirationDate) < todaysDate) throw new HttpException("Invalid past date", HttpStatus.BAD_REQUEST);

    const checkForTitle = await this.cardsRepository.findOneByTitle(title, id);
    if(checkForTitle) throw new ConflictException();

    const password = this.cryptr.encrypt(createCardDto.password);
    return await this.cardsRepository.create(user, { ...createCardDto, password })
  }

  async findAll(userId: number) {
    const cryptrCards = await this.cardsRepository.findAll(userId);
    const decryptrCards = cryptrCards.map((card) => {
      return {...card, password: this.cryptr.decrypt(card.password)}
    })
    return decryptrCards;
  }

  async findOne(id: number, user: User) {
    const card = await this.cardsRepository.findOne(id);
    if(!card) throw new NotFoundException();
    if(card.userId !== user.id) throw new ForbiddenException();

    return {...card, password: this.cryptr.decrypt(card.password)};
  }

  async remove(id: number, user: User) {
    const card = await this.cardsRepository.findOne(id);
    if(!card) throw new NotFoundException();
    if(card.userId !== user.id) throw new ForbiddenException();

    return await this.cardsRepository.delete(id);
  }

  async eraseAll(password: string, user: User){
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Password not valid.");
        
    await this.cardsRepository.eraseAll(user.id);
  }
}
