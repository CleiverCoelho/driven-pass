import { PrismaService } from "../../src/prisma/prisma.service";

export class NotesFactory {
  private title: string;
  private content: string;
  private userId: number;

  constructor(private readonly prisma: PrismaService) { }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withContent(content: string) {
    this.content = content;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      content: this.content,
      title: this.title
    }
  }

  async persist() {
    return await this.prisma.note.create({
      data: {
        title: this.title,
        content: this.content,
        user: {
          connect: {
            id: this.userId
          }
        }
      }
    });
  }
}