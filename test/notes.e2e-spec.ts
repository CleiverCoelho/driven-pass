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
import { NotesFactory } from './factories/notes.factory';
import exp from 'constants';

describe('Notes E2E Tests', () => {
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

  it("POST /notes => should create a note", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: "bearer" })
      .send(note)
      .expect(HttpStatus.CREATED);
  });

  it("POST /notes => should return with status 409 for title alredy in use", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const noteBuilt = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: "bearer" })
      .send(noteBuilt)
      .expect(HttpStatus.CONFLICT);
  });

  it("POST /notes => should return with status 404 for invalid body", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const noteBuilt = new NotesFactory(prisma)
      .withContent("Fazer compras")
      .build();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    await request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: "bearer" })
      .send(noteBuilt)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("GET /notes => should return with all notes for valid user token", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const note2 = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user2.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get('/notes')
      .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.OK);
    expect(body).toHaveLength(1);
  });

  it("GET /notes/:id => should return with note for valid noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(note);
  });

  it("GET /notes/:id => should return with status 403 for others user noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const note2 = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user2.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
    .get(`/notes/${note2.id}`)
    .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it("GET /notes/:id => should return with status 404 for invalid noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .get(`/notes/${note.id + 2}`)
      .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.NOT_FOUND);
  });

  it("DELETE /notes/:id => should delete note for valid user token and noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
    .delete(`/notes/${note.id}`)
    .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(note);
  });

  it("DELETE /notes/:id => should return with status 403 for others user noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const user2 = await new Userfactory(prisma)
      .withEmail("teste2@teste2.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const note2 = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user2.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
    .delete(`/notes/${note2.id}`)
    .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.FORBIDDEN);
  });

  it("DELETE /notes/:id => should return with status 404 for invalid noteId", async () => {
    // setup
    const user = await new Userfactory(prisma)
      .withEmail("teste@teste.com")
      .withPassword("S3nhaF0rt3!")
      .signUp();

    const note = await new NotesFactory(prisma)
      .withTitle("Mercado")
      .withContent("Fazer compras")
      .withUserId(user.id)
      .persist();

    const { token } = new AuthFactory(jwtService)
      .withEmail("teste@teste.com")
      .withId(user.id)
      .signIn();

    const { status, body } = await request(app.getHttpServer())
      .delete(`/notes/${note.id + 2}`)
      .auth(token, { type: "bearer" })
    
    expect(status).toBe(HttpStatus.NOT_FOUND);
  });
});
