import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UsersService } from '../users/users.service';
import { TweetsRepository } from './tweets.repository';
import { TweetWithUser } from './interfaces/tweets-with-user.interface';
import { User } from '@prisma/client';

@Injectable()
export class TweetsService {
  public readonly LIMIT = 15;

  constructor(
    private readonly tweetsRepository: TweetsRepository,
    private readonly usersService: UsersService
  ) { }

  async getTweets(page?: number) {
    let tweets: TweetWithUser[] = [];
    if (page) {
      const { start } = this.calculatePageLimits(page);
      tweets = await this.tweetsRepository.getTweetsByPagination(start, this.LIMIT);
    } else {
      tweets = await this.tweetsRepository.getTweets(this.LIMIT);
    }

    return this.formatTweets(tweets);
  }

  async getTweetsFromUser(username: string) {
    const tweets = await this.tweetsRepository.getTweetsFromUser(username);
    return this.formatTweets(tweets);
  }

  async createTweet(user: User, tweet: string) {
    return this.tweetsRepository.createTweet(user, tweet);
  }

  private formatTweets(tweets: TweetWithUser[]) {
    return tweets.map((tweet) => {
      const { username, avatar } = tweet.user;
      return {
        username,
        avatar,
        tweet: tweet.tweet,
      };
    });
  }

  private calculatePageLimits(page: number) {
    return {
      start: (page - 1) * this.LIMIT,
      end: page * this.LIMIT,
    };
  }
}
