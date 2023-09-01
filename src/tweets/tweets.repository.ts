import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TweetsRepository {

  constructor(private readonly prismaService: PrismaService) { }

  getTweets(limit: number) {
    return this.prismaService.tweet.findMany({
      take: limit,
      orderBy: {
        id: "desc"
      },
      include: {
        user: true
      }
    })
  }

  getTweetsByPagination(start: number, limit: number) {
    return this.prismaService.tweet.findMany({
      take: limit,
      skip: start,
      include: {
        user: true
      }
    })
  }

  getTweetsFromUser(username: string) {
    return this.prismaService.tweet.findMany({
      where: {
        user: {
          username
        }
      },
      include: {
        user: true
      }
    })
  }

  async createTweet(user: User, tweet: string) {
    return this.prismaService.tweet.create({
      data: {
        tweet,
        user: {
          connect: user
        }
      }
    })
  }
}
