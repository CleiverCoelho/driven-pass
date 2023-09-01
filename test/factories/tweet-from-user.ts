import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

type TweetBody = {
  username: string;
  tweet: string;
};

export async function tweetFromUser(app: INestApplication, body: TweetBody) {
  return request(app.getHttpServer()).post('/tweets').send(body);
}
