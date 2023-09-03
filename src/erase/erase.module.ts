import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { UsersModule } from '../users/users.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { CardsModule } from '../cards/cards.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [UsersModule, CredentialsModule, CardsModule, NotesModule],
  controllers: [EraseController],
  providers: [EraseService]
})
export class EraseModule {}
