import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { UsersModule } from 'src/users/users.module';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { CardsModule } from 'src/cards/cards.module';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [UsersModule, CredentialsModule, CardsModule, NotesModule],
  controllers: [EraseController],
  providers: [EraseService]
})
export class EraseModule {}
