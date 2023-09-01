import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

type LoginBody = {
  username: string;
  avatar: string;
};

export async function signUpUser(app: INestApplication, body: LoginBody) {
  return await request(app.getHttpServer()).post('/sign-up').send(body);
}
