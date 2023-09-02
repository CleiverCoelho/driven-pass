import { ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User } from '@prisma/client';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  private cryptr: Cryptr

  constructor(
    private readonly credentialsRepository: CredentialsRepository) {
      const Cryptr = require('cryptr');
      this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
    }

  async create(createCredentialDto: CreateCredentialDto, user : User) {
    const { title, password } = createCredentialDto;
    const { id } = user;
    const checkForTitle = await this.credentialsRepository.getCredentialByTitle(title, id);
    if(checkForTitle) throw new ConflictException("Title is already used");
    
    const cryptPassword = this.cryptr.encrypt(password);
    const createdRes = this.credentialsRepository.create(user, {...createCredentialDto, password: cryptPassword});
    return createdRes;
  }

  async findAll(user: User) {
    const { id } = user;

    const cryptrCredentials = await this.credentialsRepository.findAll(id);
    const credentials = cryptrCredentials.map((credencial) => {
      const password = this.cryptr.decrypt(credencial.password);
      return {...credencial, password};
    })

    return credentials;
  }

  async findOne(id: number, user: User) {
    const userId = user.id;
    
    const cryptCredential = await this.credentialsRepository.findOne(id);
    
    if(!cryptCredential) throw new NotFoundException();
    if(cryptCredential.userId !== userId) throw new ForbiddenException();
    
    const password = this.cryptr.decrypt(cryptCredential.password);
    return {...cryptCredential, password};
  }

  async findOneByTitle(title: string, user: User) {
    const { id } = user;
    const checkForTitle = await this.credentialsRepository.getCredentialByTitle(title, id);
    if(checkForTitle) throw new ConflictException("Title is already used");
    return checkForTitle;
  }

  async delete(id: number, user : User) {
    const cryptCredential = await this.credentialsRepository.findOne(id);
    
    if(!cryptCredential) throw new NotFoundException();
    if(cryptCredential.userId !== user.id) throw new ForbiddenException();
    
    return await this.credentialsRepository.delete(id);
  }

}
