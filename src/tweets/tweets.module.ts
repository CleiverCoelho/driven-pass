import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { UsersModule } from '../users/users.module';
import { TweetsRepository } from './tweets.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule],
  controllers: [TweetsController],
  providers: [TweetsService, TweetsRepository],
})
export class TweetsModule { }
