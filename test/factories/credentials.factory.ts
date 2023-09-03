import { PrismaService } from "../../src/prisma/prisma.service";
import Cryptr from "cryptr";

export class CredentialFactory {
  private password: string;
  private username: string;
  private url: string;
  private title: string;
  private userId: number;

  private cryptr: Cryptr

  constructor(private readonly prisma: PrismaService) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withPassword(password: string) {
    this.password = password;
    return this;
  }

  withUsername(username: string) {
    this.username = username;
    return this;
  }

  withUrl(url: string) {
    this.url = url;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      password: this.cryptr.encrypt(this.password),
      username: this.username,
      url: this.url,
      title: this.title
    }
  }

  async persist() {
    return await this.prisma.credential.create({
      data: {
        password: this.cryptr.encrypt(this.password),
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