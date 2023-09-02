import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  private cryptr: Cryptr

  constructor(private readonly cardsRepository: CardsRepository) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
  }


  async create(createCardDto: CreateCardDto, user : User) {
    const { title, expirationDate } = createCardDto;
    const { id } = user;
    
    const todaysDate = new Date();
    if(new Date(expirationDate) < todaysDate) throw new HttpException("Invalid past date", HttpStatus.BAD_REQUEST);

    const checkForTitle = await this.cardsRepository.findOneByTitle(title, id);
    if(checkForTitle) throw new ConflictException();

    const password = this.cryptr.encrypt(createCardDto.password);
    return await this.cardsRepository.create(user, { ...createCardDto, password })
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
