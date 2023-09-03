import { CardTypes } from "@prisma/client";
import { PrismaService } from "../../src/prisma/prisma.service";
import Cryptr from "cryptr";

export class CardsFactory {
  private title: string;
  private name: string;
  private number: string;
  private expirationDate: string;
  private cvv: string;
  private password: string;
  private isVirtual: boolean;
  private type: CardTypes;
  private userId: number;

  private cryptr: Cryptr;

  constructor(private readonly prisma: PrismaService) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.CRYPTR_KEY);

  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withNumber(number: string) {
    this.number = number;
    return this;
  }

  withExpirationDate(expirationDate: string) {
    this.expirationDate = expirationDate;
    return this;
  }

  withCvv(cvv: string) {
    this.cvv = cvv;
    return this;
  }

  withPassword(password: string) {
    this.password = password;
    return this;
  }

  withIsVirtual(isVirtual: boolean) {
    this.isVirtual = isVirtual;
    return this;
  }

  withType(type: CardTypes) {
    this.type = type;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      title: this.title,
      name: this.name,
      number: this.number,
      expirationDate: this.expirationDate,
      cvv: this.cvv,
      password: this.password,
      isVirtual: this.isVirtual,
      type: this.type
    }
  }

  async persist() {
    return await this.prisma.card.create({
      data: {
        title: this.title,
        name: this.name,
        number: this.number,
        expirationDate: this.expirationDate,
        cvv: this.cvv,
        password: this.cryptr.encrypt(this.password),
        isVirtual: this.isVirtual,
        type: this.type,
        user: {
          connect: {
            id: this.userId
          }
        }
      }
    });
  }
}