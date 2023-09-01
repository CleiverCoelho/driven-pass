import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { signUpUser } from './factories/signup-user';
import { tweetFromUser } from './factories/tweet-from-user';
import { cleanDb } from './utils';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { Prisma } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    await cleanDb();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = new PrismaService();
  });

  it('/health => should get an alive message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect("I'm okay!");
  });

  it('/signup => should sign-up successfully', async () => {
    await request(app.getHttpServer())
      .post('/sign-up')
      .send({
        username: 'test',
        avatar: 'http://test.com.br/image.png',
      })
      .expect(HttpStatus.OK);

    const user = await prisma.user.findFirst({
      where: {
        username: "test"
      }
    });
    expect(user).not.toBe(null);
  });

  it('/signup => should deny a sign-up when data is wrong', async () => {
    const response = await request(app.getHttpServer())
      .post('/sign-up')
      .send({
        username: 'test', // missing avatar on purpose
      })
      .expect(HttpStatus.BAD_REQUEST);

    const errorMessages: string[] = response.body.message;
    expect(errorMessages).toContain('All fields are required!');
  });

  it('POST /tweets should create a tweet', async () => {
    // setup
    const username = 'test';
    const user = await prisma.user.create({
      data: { username, avatar: 'http://test.com.br/image.png' }
    })

    await request(app.getHttpServer())
      .post('/tweets')
      .send({
        username,
        tweet: 'tweet',
      })
      .expect(HttpStatus.CREATED);

    const tweet = await prisma.tweet.findFirst({
      where: {
        userId: user.id,
      }
    });

    expect(tweet.tweet).toBe("tweet");
  });

  it('POST /tweets should fail when user did not signup before', () => {
    return request(app.getHttpServer())
      .post('/tweets')
      .send({
        username: 'test',
        tweet: 'tweet',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('GET /tweets should get only the latest 15 tweets', async () => {
    // setup
    const tweetsQtd = 20;
    const username = 'test';
    const user = await prisma.user.create({
      data: { username, avatar: 'http://test.com.br/image.png' }
    })

    for (let i = 0; i < tweetsQtd; i++) {
      await prisma.tweet.create({
        data: {
          userId: user.id,
          tweet: "tweet"
        }
      })
    }

    const response = await request(app.getHttpServer()).get('/tweets');
    expect(response.body).toHaveLength(15);
    expect(response.body[0]).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    });
  });

  it('GET /tweets should get the second page of results', async () => {
    // setup
    const tweetsQtd = 20;
    const username = 'test';
    const user = await prisma.user.create({
      data: { username, avatar: 'http://test.com.br/image.png' }
    })

    for (let i = 0; i < tweetsQtd; i++) {
      await prisma.tweet.create({
        data: {
          userId: user.id,
          tweet: "tweet"
        }
      })
    }

    const response = await request(app.getHttpServer()).get('/tweets?page=2');
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    });
  });

  it('GET /tweets should get error when page param is wrong', async () => {
    return request(app.getHttpServer())
      .get('/tweets?page=0')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('GET /tweets/:username should get the tweets of a specific user', async () => {
    // setup
    const tweetsQtd = 5;
    const username = 'test';
    const user = await prisma.user.create({
      data: { username, avatar: 'http://test.com.br/image.png' }
    })

    for (let i = 0; i < tweetsQtd; i++) {
      await prisma.tweet.create({
        data: {
          userId: user.id,
          tweet: "tweet"
        }
      })
    }

    const response = await request(app.getHttpServer()).get('/tweets/test');
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toEqual({
      username: expect.any(String),
      avatar: expect.any(String),
      tweet: expect.any(String),
    });
  });

  it('GET /tweets/:username should return an empty array is user does not exist', async () => {
    const response = await request(app.getHttpServer()).get('/tweets/user');
    expect(response.body).toHaveLength(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
