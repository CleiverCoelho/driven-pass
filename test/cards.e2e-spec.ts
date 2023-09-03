import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { E2EUtils } from './utils/e2e-utils';
import { PrismaService } from '../src/prisma/prisma.service';
import { Userfactory } from './factories/user.factory';
import { AuthFactory } from './factories/auth.factory';
import { JwtService } from '@nestjs/jwt';
import { NotesFactory } from './factories/notes.factory';
import { CardsFactory } from './factories/cards.factory';

describe('Cards E2E Tests', () => {
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

  it("POST /cards => should create a card", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user.id)
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/cards')
      .auth(token, { type: "bearer" })
      .send(card)
      .expect(HttpStatus.CREATED);
  });

  it("POST /cards => should respond with status 400 with invalid card type", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withUserId(user.id)
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/cards')
      .auth(token, { type: "bearer" })
      .send(card)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("POST /cards => should respond with status 400 with invalid EXPIRTAION DATE", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2000-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user.id)
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/cards')
      .auth(token, { type: "bearer" })
      .send(card)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("POST /cards => should respond with status 403 with title already in use", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user.id)
      .persist();

    const cardBuilt = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user.id)
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/cards')
      .auth(token, { type: "bearer" })
      .send(cardBuilt)
      .expect(HttpStatus.CONFLICT);
  });

  it("GET /cards => should respond with all cards for given user token", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user.id)
      .persist();

    const card2 = await new CardsFactory(prisma)
      .withTitle("Americanas")
      .withName("cleiver")
      .withNumber("1111111111111111")
      .withExpirationDate("2030-10")
      .withCvv("123")
      .withPassword("123456")
      .withIsVirtual(false)
      .withType("CREDIT")
      .withUserId(user2.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get('/cards')
      .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.CONFLICT);
    expect(body).toHaveLength(1);
  });

});
