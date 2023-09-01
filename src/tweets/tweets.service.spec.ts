import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { UsersService } from '../users/users.service';
import { TweetsRepository } from './tweets.repository';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { arrayContains } from 'class-validator';

describe('TweetsService', () => {
  let service: TweetsService;
  let usersService: UsersService;
  let tweetRepository: TweetsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetsService, UsersService, UsersRepository, PrismaService, TweetsRepository],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
    usersService = module.get<UsersService>(UsersService);
    tweetRepository = module.get<TweetsRepository>(TweetsRepository);
  });

  it('should return tweets', async () => {
    let tweetsFromUsers = [];
    for (let i = 1; i <= service.LIMIT; i++) {
      tweetsFromUsers.push({
        id: i,
        tweet: `teste${i}`,
        userId: i,
        user: {
          id: i,
          avatar: "https://placeholder.com/150x150",
          username: `teste${i}`
        }
      })
    };

    jest.spyOn(tweetRepository, "getTweets").mockResolvedValue(tweetsFromUsers);
    const tweets = await service.getTweets();
    expect(tweets).toHaveLength(service.LIMIT);
    expect(tweets).toEqual(expect.arrayContaining([expect.objectContaining({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    })]))
  });

  it("should not create a tweet if user doesn't exist", async () => {
    jest.spyOn(usersService, "getUserByUsername").mockResolvedValue(null);

    const dto = new CreateTweetDto();
    dto.tweet = "test";
    dto.username = "test";

    const promise = service.createTweet(dto);
    expect(promise).rejects.toThrow(new Error("User does not exist!"));
  })
});
