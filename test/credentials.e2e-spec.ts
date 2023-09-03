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

describe('Credentials E2E Tests', () => {
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

  it("POST /credentials => should create a credential", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/credentials')
      .auth(token, { type: "bearer" })
      .send(credential)
      .expect(HttpStatus.CREATED);
  });

  it("POST /credentials => should not create a credential with title already in use", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const conflitCredential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .build();
    
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/credentials')
      .auth(token, { type: "bearer" })
      .send(conflitCredential)
      .expect(HttpStatus.CONFLICT);
  });

  it("GET /credentials => should return all credentials with given token", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const credential2 = new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user2.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get('/credentials')
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.OK);
    expect(body).toHaveLength(1);

  });

  it("GET /credentials/:id => should return only the credential with given id", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    // persist() retorna a senha no banco já criptografada
    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const credential2 = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user2.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get(`/credentials/${(credential).id}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.OK);
    // expect senha descriptografada
    expect(body).toEqual({...credential, password: "123456"});

  });

  it("GET /credentials/:id => should return with status 404 for invalid given credentialId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    // persist() retorna a senha no banco já criptografada
    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get(`/credentials/${(credential).id + 1}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.NOT_FOUND);

  });

  it("GET /credentials/:id => should return with ststus 403 for others user credentialId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential2 = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user2.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get(`/credentials/${(credential2).id}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.FORBIDDEN);

  });

  it("DELETE /credentials/:id => should return with ststus 200 and delete for valid credentialId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete(`/credentials/${(credential).id}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.OK);

  });

  it("DELETE /credentials/:id => should return with ststus 403 for others user credentialId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();
    
      const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();

    const credential2 = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user2.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete(`/credentials/${(credential2).id}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it("DELETE /credentials/:id => should return with ststus 404 for invalid credentialId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(user.id)
      .persist();
      
    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete(`/credentials/${(credential).id + 1}`)
      .auth(token, { type: "bearer" });
    expect(status).toBe(HttpStatus.NOT_FOUND);

  });
});
