import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../src/prisma/prisma.service";


export class AuthFactory {
  private id: number;
  private email: string;

  private EXPIRATION_TIME = "2 days";
  private ISSUER = "Driven";
  private AUDIENCE = "users";

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  withId(id: number) {
    this.id = id;
    return this;
  }

  signIn(){
    const token = this.jwtService.sign({ email: this.email }, { // payload => "corpo do jwt" [OBRIGATORIO]
      expiresIn: this.EXPIRATION_TIME, // por quanto tempo isso aqui é válido? [OPT]
      subject: String(this.id), // de quem é esse token? id [OPT]
      issuer: this.ISSUER, // quem tá emitindo esse token lindão? // driven [OPT]
      audience: this.AUDIENCE, // pra qual serviço esse token está sendo gerado? // users [OPT]
      secret: process.env.JWT_SECRET
    })

    return { token }
  }
}