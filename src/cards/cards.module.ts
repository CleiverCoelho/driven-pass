import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  exports: [CardsService]
})
export class CardsModule {}
