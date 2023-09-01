import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) { }

  @Get()
  async getTweets(@Query('page') page: number = undefined) {
    if (page && (isNaN(page) || page <= 0)) {
      throw new HttpException('Invalid page value', HttpStatus.BAD_REQUEST);
    }

    return this.tweetsService.getTweets(page);
  }

  @Get('/:username')
  async getTweetsFromUsername(@Param('username') username: string) {
    return await this.tweetsService.getTweetsFromUser(username);
  }

  @Post()
  @UseGuards(AuthGuard) // guardar que protegem a minha rota
  async createTweet(@Body() tweetDTO: CreateTweetDto, @User() user: UserPrisma) {
    try {
      return await this.tweetsService.createTweet(user, tweetDTO.tweet);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
