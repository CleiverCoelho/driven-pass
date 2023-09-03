import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import CreateUserDto from 'src/users/dtos/login.dto';

@Controller('users')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post("/sign-up")
  @ApiBody({ type: SignUpDto })
  @ApiOperation({ summary: "creates a user account" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, "description": "needs a stronger password"})
  @ApiResponse({ status: HttpStatus.CONFLICT, "description": "email already in use."})
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("/sign-in")
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: "generates a login JWT token"})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, "description": "needs a stronger password"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "email or password not valid"})
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

}
