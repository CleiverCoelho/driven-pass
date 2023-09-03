import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma} from '@prisma/client';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("credentials")
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateCredentialDto })
  @ApiOperation({ summary: "creates a credential info note"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user : UserPrisma) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns all users registered credentials"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns an especific registered credential"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to access another users credential"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to access a credential that does not exist"})
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns an especific registered credential"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to delete another users credential"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to delete a credential that does not exist"})
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialsService.delete(+id, user);
  }
}
