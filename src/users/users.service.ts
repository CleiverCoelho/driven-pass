import { ConflictException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import CreateUserDto from './dtos/login.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(userDto: CreateUserDto) {
    const { username } = userDto;
    const user = await this.usersRepository.getUserByUsername(username);
    if (user) throw new ConflictException("Username already in use.");

    return await this.usersRepository.create(userDto);
  }

  async getById(id: number) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException("User not found!");

    return user;
  }

  async getUserByUsername(username: string) {
    return await this.usersRepository.getUserByUsername(username);
  }
}
