import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private EXPIRATION_TIME = "7 days";
  private ISSUER = "Driven";
  private AUDIENCE = "users";

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService) { }

  async signUp(signUpDto: SignUpDto) {
    return await this.userService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new UnauthorizedException("Email or password not valid.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("Email or password not valid.");

    return this.createToken(user);

  }

  createToken(user: User) {
    const { id, username } = user;
    //const token = this.jwtService.sign({username, id}); // quero fazer sem nada opcional

    const token = this.jwtService.sign({ username }, { // payload => "corpo do jwt" [OBRIGATORIO]
      expiresIn: this.EXPIRATION_TIME, // por quanto tempo isso aqui é válido? [OPT]
      subject: String(id), // de quem é esse token? id [OPT]
      issuer: this.ISSUER, // quem tá emitindo esse token lindão? // driven [OPT]
      audience: this.AUDIENCE // pra qual serviço esse token está sendo gerado? // users [OPT]
    })

    return { token };
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER
    });

    return data;
  }

}
