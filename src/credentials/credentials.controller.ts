import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma} from '@prisma/client';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user : UserPrisma) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    return this.credentialsService.delete(+id, user);
  }
}
