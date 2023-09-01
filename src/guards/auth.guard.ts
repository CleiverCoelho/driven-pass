import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }


  async canActivate(context: ExecutionContext) {
    // na requisição
    const request = context.switchToHttp().getRequest(); // estamos pegando o objeto da request
    const { authorization } = request.headers;

    // regras
    try {
      const data = this.authService.checkToken((authorization ?? "").split(" ")[1]); // token é legítimo?
      const user = await this.usersService.getById(parseInt(data.sub));
      request.user = user; // colocando o usuário dentro da requiosição ou resposta
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException()
    }
  }

}