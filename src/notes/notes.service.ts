import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '@prisma/client';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) { }

  async create(createNoteDto: CreateNoteDto, user: User) {
    const { title } = createNoteDto;
    const { id } = user;
    
    const checkForTitle = await this.notesRepository.findOneByTitle(title, id);
    if(checkForTitle) throw new ConflictException("Title is already used");
    
    return await this.notesRepository.create(user, createNoteDto);
  }

  async findAll(id: number) {
    return await this.notesRepository.findAll(id);
  }

  async findOne(id: number, userId: number) {
    const note =  await this.notesRepository.findOne(id);
    
    if(!note) throw new NotFoundException();
    if(note.userId !== userId) throw new ForbiddenException();

    return note;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
