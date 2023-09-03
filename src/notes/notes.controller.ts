import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("notes")
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateNoteDto })
  @ApiOperation({ summary: "creates a generic note"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  create(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns all users registered notes"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  findAll(@User() user: UserPrisma) {
    const { id } = user;
    return this.notesService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns an especific registered note"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to access another users note"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to access a note that does not exist"})
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    const userId = user.id;
    return this.notesService.findOne(+id, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "returns an especific registered note"})
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, "description": "token was not given or is invalid"})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, "description": "if you try to delete another users note"})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, "description": "if yout try to delete a note that does not exist"})
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    const userId = user.id;
    return this.notesService.remove(+id, userId);
  }
}
