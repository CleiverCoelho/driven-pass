import { Injectable, Scope } from '@nestjs/common';
import CreateUserDto from './dtos/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  create(userDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...userDto,
        password: bcrypt.hashSync(userDto.password, this.SALT)
      }
    })
  }

  getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  getUserByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username }
    })
  }
}
