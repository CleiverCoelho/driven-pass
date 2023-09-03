import { PrismaService } from "../../src/prisma/prisma.service";

export class E2EUtils {
  static async cleanDb(prisma: PrismaService) {
    await prisma.credential.deleteMany();
    await prisma.note.deleteMany();
    await prisma.card.deleteMany();
    await prisma.user.deleteMany();
  }

}