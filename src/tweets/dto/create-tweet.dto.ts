import { IsNotEmpty } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  tweet: string;
}
