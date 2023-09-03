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
import { CardsFactory } from './factories/cards.factory';
import { NotesFactory } from './factories/notes.factory';

describe('Erase E2E Tests', () => {
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

  it("DELETE /erase => should erase all users info including his profile", async () => {
    // setup

    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = await new CardsFactory(prisma)
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

    const credential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete('/erase')
      .auth(token, { type: "bearer" })
      .send({ password: "S3nhaF0rt3!"})    
    expect(status).toBe(HttpStatus.OK);
    // retorna o perfil de usuario apagado e sua senha criptografada
    expect(body).toEqual(user);
  });

  it("DELETE /erase => should respond with status 401 if the check password is wrong", async () => {
    // setup

    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const card = await new CardsFactory(prisma)
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

    const credential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete('/erase')
      .auth(token, { type: "bearer" })
      .send({ password: "S3nhaF0rt3ERRADA!"})    
    expect(status).toBe(HttpStatus.UNAUTHORIZED);
  });

});
