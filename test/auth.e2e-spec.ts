import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { E2EUtils } from './utils/e2e-utils';
import { PrismaService } from '../src/prisma/prisma.service';
import { CredentialFactory } from './factories/credentials.factory';
import { Userfactory } from './factories/user.factory';
import { AuthFactory } from './factories/auth.factory';
import { JwtService } from '@nestjs/jwt';

describe('Auth && Users E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let jwtService : JwtService = new JwtService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  })

  it("POST /credentials => should create a user account", async () => {
    // setup
    const user = new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .build();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user)
      .expect(HttpStatus.CREATED);
  });

  it("POST /credentials => should not create a user account with email already in use", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const userBuild = new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .build();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userBuild)
      .expect(HttpStatus.CONFLICT);
  });

  it("POST /credentials => should not create a user account with weak password", async () => {
    // setup

    const userBuild = new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("SenhaFraca")
      .build();

    await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(userBuild)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("POST /credentials => should create a sign-in token", async () => {
    // setup

    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const userBuild = new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .build();

    const { status, body } = await request(app.getHttpServer()).post('/users/sign-in').send(userBuild)
      .expect(HttpStatus.OK)
  });

  it("POST /credentials => should not create a sign-in token with invalid email/password", async () => {
    // setup

    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const userBuild = new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("SenhaF0rt3Errada!")
      .build();

    const { status, body } = await request(app.getHttpServer()).post('/users/sign-in').send(userBuild)
      .expect(HttpStatus.UNAUTHORIZED)
  });

});
