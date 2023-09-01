import { PrismaClient } from "@prisma/client";

export async function cleanDb() {
  const prisma = new PrismaClient();
  await prisma.tweet.deleteMany();
  await prisma.user.deleteMany();
}