import { PrismaService } from "../../src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

export class Userfactory {
  private password: string;
  private email: string;

  constructor(private readonly prisma: PrismaService) { }

  withPassword(password: string) {
    this.password = password;
    return this;
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  async signUp() {
    return await this.prisma.user.create({
      data: {
        password: bcrypt.hashSync(this.password, 10),
        email: this.email      
      }
    });
  }
}