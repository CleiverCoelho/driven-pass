import { PrismaService } from "../../src/prisma/prisma.service";


export class PublicationFactory {
  private password: string;
  private username: string;
  private url: string;
  private title: string;
  private userId: number;

  constructor(private readonly prisma: PrismaService) { }

  build() {
    return {
      password: this.password,
      username: this.username,
      url: this.url,
      title: this.title
    }
  }

  async persist() {
    return await this.prisma.credential.create({
      data: {
        password: this.password,
        username: this.username,
        url: this.url,
        title: this.title,
        user: {
          connect: {
            id: this.userId
          }
        }
      }
    });
  }
}