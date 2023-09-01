import { PrismaClient } from "@prisma/client";

export class SignupFactory {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createSignup(username: string, avatar: string) {
    return this.prisma.user.create({
      data: {
        username,
        avatar
      }
    })
  }
}