import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CardsService } from '../cards/cards.service';
import { CredentialsService } from '../credentials/credentials.service';
import { NotesService } from '../notes/notes.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class EraseService {
    constructor(
        private readonly cardsService: CardsService,        
        private readonly credentialsService: CredentialsService,
        private readonly notesService: NotesService,
        private readonly usersService: UsersService
    ) { }

    async eraseAll(password: string, user: User){
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Password not valid.");
        
        const cardsErased = await this.cardsService.eraseAll(password, user);
        const notesErased = await this.notesService.eraseAll(password, user);
        const credentialsErased = await this.credentialsService.eraseAll(password, user);
        return await this.usersService.delete(user.id);
    }
}
