import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { E2EUtils } from './utils/e2e-utils';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateCredentialDto } from 'src/credentials/dto/create-credential.dto';
import { CredentialFactory } from './factories/credentials.factory';

describe('Credentials E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

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
    const credential = await new CredentialFactory(prisma)
      .withTitle("Facebook")
      .withUsername("cleiver")
      .withPassword("123456")
      .withUrl("https://facebook.com")
      .withUserId(1)
      .persist();

    // body
    const mediaDto: CreateMediaDto = new CreateMediaDto({
      title: "Facebook",
      username: "test@test.com"
    });

    await request(app.getHttpServer())
      .post('/medias')
      .send(mediaDto)
      .expect(HttpStatus.CONFLICT)
  });

  // it("POST /medias => should not create a media with properties missing", async () => {
  //   // setup
  //   const mediaDto = new CreateMediaDto(); // missing name on purpose

  //   await request(app.getHttpServer())
  //     .post('/medias')
  //     .send(mediaDto)
  //     .expect(HttpStatus.BAD_REQUEST)
  // });

  // it("GET /medias => should get all medias", async () => {
  //   // setup
  //   await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   await new MediaFactory(prisma)
  //     .withTitle("Twitter")
  //     .withUsername("test@test.com")
  //     .persist();

  //   const { status, body } = await request(app.getHttpServer()).get("/medias");
  //   expect(status).toBe(HttpStatus.OK);
  //   expect(body).toHaveLength(2);
  // });

  // it("GET /medias/:id => should get specific medias", async () => {
  //   // setup
  //   const facebook = await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   await new MediaFactory(prisma)
  //     .withTitle("Twitter")
  //     .withUsername("test@test.com")
  //     .persist();

  //   const { status, body } = await request(app.getHttpServer()).get(`/medias/${facebook.id}`);
  //   expect(status).toBe(HttpStatus.OK);
  //   expect(body).toEqual({
  //     id: expect.any(Number),
  //     title: "Facebook",
  //     username: "test@test.com"
  //   })
  // });


  // it("GET /medias/:id => should get an error when specific media does not exist", async () => {
  //   const { status } = await request(app.getHttpServer()).get(`/medias/9999`);
  //   expect(status).toBe(HttpStatus.NOT_FOUND);
  // });

  // it('PUT /medias => should update a media', async () => {
  //   // setup
  //   const facebook = await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   // body
  //   const mediaDto: CreateMediaDto = new CreateMediaDto();
  //   mediaDto.title = "Meta";
  //   mediaDto.username = "test@test.com.br";

  //   await request(app.getHttpServer())
  //     .put(`/medias/${facebook.id}`)
  //     .send(mediaDto)
  //     .expect(HttpStatus.OK)

  //   const medias = await prisma.media.findMany();
  //   expect(medias).toHaveLength(1);
  //   const media = medias[0];
  //   expect(media).toEqual({
  //     id: expect.any(Number),
  //     title: mediaDto.title,
  //     username: mediaDto.username
  //   })
  // });

  // it('PUT /medias => should not update a media if the info already exists', async () => {
  //   // setup
  //   const facebook = await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   await new MediaFactory(prisma)
  //     .withTitle("Twitter")
  //     .withUsername("test@test.com")
  //     .persist();

  //   // body
  //   const mediaDto: UpdateMediaDto = new UpdateMediaDto({
  //     title: "Twitter",
  //     username: "test@test.com"
  //   });

  //   await request(app.getHttpServer())
  //     .put(`/medias/${facebook.id}`)
  //     .send(mediaDto)
  //     .expect(HttpStatus.CONFLICT)
  // });

  // it('PUT /medias => should not update a media if does not exist', async () => {
  //   // body
  //   const mediaDto: UpdateMediaDto = new UpdateMediaDto({
  //     title: "Twitter",
  //     username: "test@test.com"
  //   });

  //   await request(app.getHttpServer())
  //     .put(`/medias/9999`)
  //     .send(mediaDto)
  //     .expect(HttpStatus.NOT_FOUND)
  // });

  // it('DELETE /medias => should delete a media', async () => {
  //   // setup
  //   const media = await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   await request(app.getHttpServer())
  //     .delete(`/medias/${media.id}`)
  //     .expect(HttpStatus.OK);

  //   const medias = await prisma.media.findMany();
  //   expect(medias).toHaveLength(0);
  // });

  // it('DELETE /medias => should not delete a media if does not exist', async () => {
  //   await request(app.getHttpServer())
  //     .delete(`/medias/9999`)
  //     .expect(HttpStatus.NOT_FOUND);
  // });

  // it('DELETE /medias => should not delete a media if scheduled or published', async () => {
  //   // setup
  //   const media = await new MediaFactory(prisma)
  //     .withTitle("Facebook")
  //     .withUsername("test@test.com")
  //     .persist();

  //   const post = await new PostFactory(prisma)
  //     .withText("Testing is fun!")
  //     .withTitle("Testing is fun!")
  //     .persist();

  //   await new PublicationFactory(prisma)
  //     .withMediaId(media.id)
  //     .withPostId(post.id)
  //     .withDate(new Date())
  //     .persist();

  //   await request(app.getHttpServer())
  //     .delete(`/medias/${media.id}`)
  //     .expect(HttpStatus.FORBIDDEN);
  // });

});
