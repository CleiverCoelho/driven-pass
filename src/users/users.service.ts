import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import CreateUserDto from './dtos/login.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) throw new ConflictException("Email already in use.");

    return await this.usersRepository.create(userDto);
  }

  async getById(id: number) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException("User not found!");

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async delete(id: number){
    return await this.usersRepository.delete(id);
  }
}
