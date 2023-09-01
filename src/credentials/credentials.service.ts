import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository) { }

  async create(createCredentialDto: CreateCredentialDto, user : User) {
    const { title } = createCredentialDto;
    const checkForTitle = await this.credentialsRepository.getCredentialByTitle(title);
    if(checkForTitle) throw new ConflictException("Title is already used")
    const createdRes = this.credentialsRepository.create(user, createCredentialDto);
    return createdRes;
  }

  findAll() {
    return `This action returns all credentials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} credential`;
  }

  findOneByTitle(title: string) {
    return this.credentialsRepository.getCredentialByTitle(title);
  }

  update(id: number, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

  remove(id: number) {
    return `This action removes a #${id} credential`;
  }
}
